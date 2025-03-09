const { getHivePrice, tradeHive, getHBDPrice, tradeHBD } = require("../services/binanceService");
const { predictMarketTrend } = require("../services/aiTradingService");
const { initTradeConfig } = require("../services/tradeConfigService");
const { getUserBalance } = require("../services/hiveService"); // Fetch user's real balance

const tradeConfig = {
    tradeAmount: 10,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    autoInvestPercentage: 50
};

initTradeConfig(tradeConfig);

let tradeIntervals = {}; // Store user-specific intervals

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

// Start trading for HIVE
const autoTradeHive = async (user, frequency) => {
    return startAutoTrading(user, "HIVE", getHivePrice, tradeHive, frequency);
};

// Start trading for HBD
const autoTradeHBD = async (user, frequency) => {
    return startAutoTrading(user, "HBD", getHBDPrice, tradeHBD, frequency);
};

// Stop auto-trading for a user
const stopAutoTrade = (user) => {
    Object.keys(tradeIntervals).forEach((key) => {
        if (key.startsWith(user.username)) {
            clearInterval(tradeIntervals[key]);
            delete tradeIntervals[key];
        }
    });

    console.log(`🛑 Auto-trading stopped for ${user.username}`);
    return { success: true, message: "Auto-trading stopped" };
};

module.exports = { autoTradeHive, autoTradeHBD, stopAutoTrade };
