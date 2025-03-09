const { io } = require("../server");

// Simulated user balance
let userBalances = {};

// Dummy trade configuration
const tradeConfig = {
    tradeAmount: 10,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    autoInvestPercentage: 50
};

let tradeIntervals = {}; 

const frequencyToMs = {
    "Continue AUTO_INVEST.": 1000,
    "for 5 min.": 5 * 60 * 1000,
    "for 10 min.": 10 * 60 * 1000,
    "for 15 min.": 15 * 60 * 1000
};

// Function to generate random price changes
const getRandomPrice = (currentPrice) => {
    let change = (Math.random() * 0.1 - 0.05).toFixed(4); // ±5% change
    return Math.max(0.01, (currentPrice + parseFloat(change)).toFixed(4));
};

// Simulated AI Market Prediction
const predictMarketTrend = (price) => {
    if (price < 0.4) return "BUY";
    if (price > 0.6) return "SELL";
    return "HOLD";
};

// Simulated trading function
const tradeSimulation = (action, amount, username, asset) => {
    if (!userBalances[username]) userBalances[username] = { HIVE: 100, HBD: 100 };

    if (action === "BUY") {
        userBalances[username][asset] += amount;
    } else if (action === "SELL" && userBalances[username][asset] >= amount) {
        userBalances[username][asset] -= amount;
    }

    console.log(`📊 [SIMULATION] ${username} ${action} ${amount} ${asset}. Balance: ${userBalances[username][asset]}`);
};

// Simulated auto trading
const startAutoTrading = async (user, asset, frequency) => {
    let price = 0.5; // Starting dummy price
    const intervalMs = frequencyToMs[frequency];

    if (!intervalMs) {
        console.error(`❌ Invalid frequency: ${frequency}`);
        return { action: "hold", reason: "Invalid frequency" };
    }

    if (tradeIntervals[`${user.username}_${asset}`]) {
        clearInterval(tradeIntervals[`${user.username}_${asset}`]);
    }

    console.log(`🔵 Starting simulated trading for ${asset} every ${frequency}`);

    tradeIntervals[`${user.username}_${asset}`] = setInterval(async () => {
        price = getRandomPrice(price); // Simulate price movement

        let prediction = predictMarketTrend(price);
        let tradeAction = "hold";
        let reason = "Market stable";

        if (prediction === "BUY") {
            tradeAction = "buy";
            reason = `Simulated AI suggests buying ${asset}`;
            tradeSimulation("BUY", tradeConfig.tradeAmount, user.username, asset);
        } else if (prediction === "SELL") {
            tradeAction = "sell";
            reason = `Simulated AI suggests selling ${asset}`;
            tradeSimulation("SELL", tradeConfig.tradeAmount, user.username, asset);
        }

        console.log(`📈 [SIMULATION] ${asset} Price: $${price}`);
        console.log(`✅ [SIMULATION] ${tradeAction.toUpperCase()} ${tradeConfig.tradeAmount} ${asset}`);

        io.emit("tradeUpdate", {
            username: user.username,
            asset,
            action: tradeAction,
            amount: tradeConfig.tradeAmount,
            price,
            message: `Simulated trade: ${tradeAction} ${tradeConfig.tradeAmount} ${asset} at $${price}`
        });

    }, intervalMs);

    return { action: "started", reason: `Simulated trading every ${frequency}` };
};

// Stop trading simulation
const stopAutoTrade = async (req, res) => {
    try {
        const { username } = req.body;
        Object.keys(tradeIntervals).forEach((key) => {
            if (key.startsWith(username)) {
                clearInterval(tradeIntervals[key]);
                delete tradeIntervals[key];
            }
        });
        console.log(`🛑 Simulated auto-trading stopped for ${username}`);
        res.json({ success: true, message: "Simulated trading stopped" });
    } catch (error) {
        console.error("Error stopping simulated auto-trade:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { startAutoTrading, stopAutoTrade };
