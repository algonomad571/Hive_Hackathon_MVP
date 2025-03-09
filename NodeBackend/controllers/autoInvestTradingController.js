const { io } = require("../server");
const { predictMarketTrend } = require("../services/aiTradingService");
const { getUserBalance, getHivePrice, getHBDPrice } = require("../services/hiveService");

const tradeConfig = {
    tradeAmount: 10,
    autoInvestPercentage: 50
};

let tradeIntervals = {}; // Store user-specific trade intervals

const startAutoTrading = async (user, asset) => {
    const intervalMs = 1000; // Auto-trade every 1 second

    if (tradeIntervals[`${user.username}_${asset}`]) {
        clearInterval(tradeIntervals[`${user.username}_${asset}`]);
        console.log(`🛑 Stopping previous trading session for ${asset} - ${user.username}`);
    }

    console.log(`🔵 Starting auto-trading for ${asset} every 1 second`);

    tradeIntervals[`${user.username}_${asset}`] = setInterval(async () => {
        console.log(`⏳ Fetching ${asset} price and user balance...`);

        const price = asset === "HIVE" ? await getHivePrice() : await getHBDPrice();
        if (!price) return console.log(`⚠️ ${asset} price unavailable`);

        console.log(`📈 Current ${asset} Price: $${price}`);

        // Get user's balance from Hive
        const userBalance = await getUserBalance(user.username, asset);
        if (!userBalance || userBalance <= 0) {
            console.log(`🚫 ${user.username} has insufficient ${asset} balance`);
            return;
        }

        let autoInvestAmount = (tradeConfig.autoInvestPercentage / 100) * userBalance;

        let prediction = await predictMarketTrend(asset, price);
        let tradeAction = "hold";

        if (prediction === "BUY") {
            tradeAction = "buy";
            console.log(`📢 AI suggests buying ${autoInvestAmount} ${asset}`);
        } else if (prediction === "SELL") {
            tradeAction = "sell";
            console.log(`📢 AI suggests selling ${autoInvestAmount} ${asset}`);
        }

        console.log(`✅ Simulated trade: ${tradeAction} ${autoInvestAmount} ${asset} at $${price}`);

        // Emit trade update to frontend
        io.emit("tradeUpdate", {
            username: user.username,
            asset,
            action: tradeAction,
            amount: autoInvestAmount,
            price,
            timestamp: new Date().toISOString(),
            message: `Simulated Trade: ${tradeAction} ${autoInvestAmount} ${asset} at $${price}`
        });

    }, intervalMs);

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
