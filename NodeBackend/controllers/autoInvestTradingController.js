const { io } = require("../server"); // Import WebSocket instance
const { getHivePrice, tradeHive, getHBDPrice, tradeHBD } = require("../services/binanceService");
const { predictMarketTrend } = require("../services/aiTradingService");
const { getUserBalance } = require("../services/hiveService"); // Fetch user's real balance

const tradeConfig = {
    tradeAmount: 10,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    autoInvestPercentage: 50
};

let tradeIntervals = {}; // Store user-specific trade intervals

// Frequency Mapping from Dropdown
const frequencyToMs = {
    "Continue AUTO_INVEST.": 1000,
    "for 5 min.": 5 * 60 * 1000,
    "for 10 min.": 10 * 60 * 1000,
    "for 15 min.": 15 * 60 * 1000,
    "for 20 min.": 20 * 60 * 1000,
    "for 25 min.": 25 * 60 * 1000,
    "for 30 min.": 30 * 60 * 1000
};

const startAutoTrading = async (user, asset, getPriceFn, tradeFn, frequency) => {
    const intervalMs = frequencyToMs[frequency];

    if (!intervalMs) {
        console.error(`❌ Invalid frequency: ${frequency}`);
        return { action: "hold", reason: "Invalid frequency selected" };
    }

    // Stop previous trading session if running
    if (tradeIntervals[`${user.username}_${asset}`]) {
        clearInterval(tradeIntervals[`${user.username}_${asset}`]);
        console.log(`🛑 Stopping previous trading session for ${asset} - ${user.username}`);
    }

    console.log(`🔵 Starting auto-trading for ${asset} every ${frequency}`);

    tradeIntervals[`${user.username}_${asset}`] = setInterval(async () => {
        console.log(`⏳ Executing trade for ${asset} - ${user.username}`);

        const price = await getPriceFn();
        if (!price) return console.log(`⚠️ ${asset} price unavailable`);

        console.log(`📈 Current ${asset} Price: $${price}`);

        // Get user's balance
        const userBalance = await getUserBalance(user.username, asset);
        if (!userBalance || userBalance <= 0) {
            console.log(`🚫 Insufficient balance for ${user.username} to trade ${asset}`);
            return;
        }

        let autoInvestAmount = (tradeConfig.autoInvestPercentage / 100) * userBalance;

        let prediction = await predictMarketTrend(asset, price);
        let tradeAction = "hold";
        let reason = "Market stable";

        if (prediction === "BUY") {
            tradeAction = "buy";
            reason = `AI suggests buying ${asset}`;
            await tradeFn("BUY", autoInvestAmount, user.username);  
        } else if (prediction === "SELL") {
            tradeAction = "sell";
            reason = `AI suggests selling ${asset}`;
            await tradeFn("SELL", autoInvestAmount, user.username);
        }

        console.log(`✅ Trade executed: ${tradeAction} ${autoInvestAmount} ${asset} at $${price}`);

        // **Emit trade event to frontend**
        io.emit("tradeUpdate", {
            username: user.username,
            asset,
            action: tradeAction,
            amount: autoInvestAmount,
            price,
            timestamp: new Date().toISOString(),
            message: `Trade executed: ${tradeAction} ${autoInvestAmount} ${asset} at $${price}`
        });

    }, intervalMs);

    return { action: "started", reason: `Trading every ${frequency}` };
};

// 🟢 Start Auto Trading (HIVE)
async function autoTradeHive(req) {
    try {
        const hivePrice = await getHivePrice(); // Fetch live price
        let tradeDecision = "HOLD"; // Default decision

        if (hivePrice < 0.45) {
            tradeDecision = "BUY";
        } else if (hivePrice > 0.50) {
            tradeDecision = "SELL";
        }

        return { success: true, tradeDecision, tradePrice: hivePrice };
    } catch (error) {
        console.error("Error in autoTradeHive:", error);
        return { success: false, error: "Error processing HIVE trade" };
    }
}

// 🟢 Start Auto Trading (HBD)
async function autoTradeHBD(req) {
    try {
        const hbdPrice = await getHBDPrice(); // Fetch live price
        let tradeDecision = "HOLD"; // Default decision

        if (hbdPrice < 0.98) {
            tradeDecision = "BUY";
        } else if (hbdPrice > 1.02) {
            tradeDecision = "SELL";
        }

        return { success: true, tradeDecision, tradePrice: hbdPrice };
    } catch (error) {
        console.error("Error in autoTradeHBD:", error);
        return { success: false, error: "Error processing HBD trade" };
    }
}


// 🛑 Stop Auto Trading
const stopAutoTrade = async (req, res) => {
    try {
        const { username } = req.body;

        Object.keys(tradeIntervals).forEach((key) => {
            if (key.startsWith(username)) {
                clearInterval(tradeIntervals[key]);
                delete tradeIntervals[key];
            }
        });

        console.log(`🛑 Auto-trading stopped for ${username}`);
        res.json({ success: true, message: "Auto-trading stopped" });
    } catch (error) {
        console.error("Error stopping auto-trade:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { autoTradeHive, autoTradeHBD, stopAutoTrade };
