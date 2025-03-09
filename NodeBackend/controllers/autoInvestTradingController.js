const { io } = require("../server"); 
const { predictMarketTrend } = require("../services/aiTradingService");
const { getUserBalance } = require("../services/hiveService");

const tradeConfig = {
    tradeAmount: 10,
    autoInvestPercentage: 50
};

let tradeIntervals = {}; // Store user-specific trade intervals

const startAutoTrading = async (user, asset, getPriceFn, tradeFn) => {
    const intervalMs = 1000; // Force API calls every 1 second

    // Stop previous trading session if running
    if (tradeIntervals[`${user.username}_${asset}`]) {
        clearInterval(tradeIntervals[`${user.username}_${asset}`]);
        console.log(`🛑 Stopping previous trading session for ${asset} - ${user.username}`);
    }

    console.log(`🔵 Starting auto-trading for ${asset} every 1 second`);

    tradeIntervals[`${user.username}_${asset}`] = setInterval(async () => {
        console.log(`⏳ Executing trade for ${asset} - ${user.username}`);

        const price = await getPriceFn();
        if (!price) return console.log(`⚠️ ${asset} price unavailable`);

        console.log(`📈 Current ${asset} Price: $${price}`);

        // Simulate fetching user balance
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

        // Emit trade event to frontend
        io.emit("tradeUpdate", {
            username: user.username,
            asset,
            action: tradeAction,
            amount: autoInvestAmount,
            price,
            timestamp: new Date().toISOString(),
            message: `Trade executed: ${tradeAction} ${autoInvestAmount} ${asset} at $${price}`
        });

    }, intervalMs); // Force 1-second interval

    return { action: "started", reason: `Trading every 1 second` };
};

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

module.exports = { startAutoTrading, stopAutoTrade };
