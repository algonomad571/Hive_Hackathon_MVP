const { getHivePrice, tradeHive, getHBDPrice, tradeHBD } = require("../services/binanceService");
const { predictMarketTrend } = require("../services/aiTradingService");
const { initTradeConfig } = require("../services/tradeConfigService");
const { getUserBalance } = require("../services/hiveService"); // Fetch user's real balance
const { getUserFrequency } = require("../services/frequencyService"); // Service to fetch user frequency

const tradeConfig = {
    tradeAmount: 10,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    autoInvestPercentage: 50
};

initTradeConfig(tradeConfig);

let tradeIntervals = {}; // Store user-specific intervals

const startAutoTrading = async (user, asset, getPriceFn, tradeFn, frequency) => {
    if (!frequencyToMs[frequency]) {
        console.error(`❌ Invalid frequency: ${frequency}`);
        return { action: "hold", reason: "Invalid frequency selected" };
    }

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

        // Get the user's real Hive/HBD balance
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
            await tradeFn("BUY", autoInvestAmount, user.username);  // Execute real transaction
        } else if (prediction === "SELL") {
            tradeAction = "sell";
            reason = `AI suggests selling ${asset}`;
            await tradeFn("SELL", autoInvestAmount, user.username); // Execute real transaction
        }

        console.log(`✅ Trade executed: ${tradeAction} ${autoInvestAmount} ${asset} at $${price}`);
    }, frequencyToMs[frequency]);

    return { action: "started", reason: `Trading every ${frequency}` };
};

// 🟢 API to Fetch User's Frequency
const getUserAutoInvestFrequency = async (req, res) => {
    try {
        const { username } = req.params;
        const frequency = await getUserFrequency(username);

        if (!frequency) {
            return res.status(404).json({ error: "Frequency not set" });
        }

        res.json({ frequency });
    } catch (error) {
        console.error("Error fetching frequency:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🟢 API to Start Auto Trading (Called when Button is Pressed)
const autoTradeHive = async (req, res) => {
    try {
        const { username } = req.body;

        // Fetch user's saved frequency
        const frequency = await getUserFrequency(username);
        if (!frequency) {
            return res.status(400).json({ error: "No frequency set for auto-investment" });
        }

        const result = await startAutoTrading({ username }, "HIVE", getHivePrice, tradeHive, frequency);
        res.json(result);
    } catch (error) {
        console.error("Error in autoTradeHive:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🟢 API to Start Auto Trading for HBD
const autoTradeHBD = async (req, res) => {
    try {
        const { username } = req.body;

        // Fetch user's saved frequency
        const frequency = await getUserFrequency(username);
        if (!frequency) {
            return res.status(400).json({ error: "No frequency set for auto-investment" });
        }

        const result = await startAutoTrading({ username }, "HBD", getHBDPrice, tradeHBD, frequency);
        res.json(result);
    } catch (error) {
        console.error("Error in autoTradeHBD:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🛑 API to Stop Auto Trading
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

module.exports = { getUserAutoInvestFrequency, autoTradeHive, autoTradeHBD, stopAutoTrade };
