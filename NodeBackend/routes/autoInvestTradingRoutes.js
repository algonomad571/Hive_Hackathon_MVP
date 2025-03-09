const express = require("express");
const { autoTradeHive, autoTradeHBD } = require("../controllers/autoInvestTradingController");
const { getHivePrice, getHBDPrice } = require("../services/hivePriceService");
const router = express.Router();

// Predefined frequency options
const frequencyOptions = {
    "Continue AUTO_INVEST.": 1000,
    "for 5 min.": 5 * 60 * 1000,
    "for 10 min.": 10 * 60 * 1000,
    "for 15 min.": 15 * 60 * 1000,
    "for 20 min.": 20 * 60 * 1000,
    "for 25 min.": 25 * 60 * 1000,
    "for 30 min.": 30 * 60 * 1000
};

// ✅ Function to determine trading action
function decideTradeAction(currentPrice, previousPrice) {
    if (!previousPrice) return "HOLD"; // No previous price available

    const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    if (changePercent > 2) return "SELL"; // Sell if price increased more than 2%
    if (changePercent < -2) return "BUY";  // Buy if price dropped more than 2%
    
    return "HOLD"; // Otherwise, hold
}

// Store last known prices
let lastHivePrice = null;
let lastHbdPrice = null;

// ✅ Start auto-trading with price details and trade decision
router.post("/trade", async (req, res) => {
    try {
        const { user, frequency } = req.body;

        if (!user || !user.username) {
            return res.status(400).json({ success: false, error: "Valid user information is required." });
        }

        if (!frequency || !frequencyOptions[frequency]) {
            return res.status(400).json({ success: false, error: "Invalid frequency selected." });
        }

        console.log(`🚀 Auto-trading started for ${user.username} every ${frequency}`);

        // Get live HIVE price
        const hivePrice = await getHivePrice();
        if (!hivePrice) {
            return res.status(500).json({ success: false, error: "Failed to fetch HIVE price." });
        }

        console.log(`📈 HIVE Price: $${hivePrice}`);

        // Perform auto-trade for HIVE only
        const hiveResult = await autoTradeHive(req);

        return res.json({
            success: true,
            message: `🚀 Auto-trading started for ${user.username} every ${frequency}`,
            hivePrice,
            hiveTrade: hiveResult
        });

    } catch (error) {
        console.error(`🚨 Error processing auto-trading:`, error);
        return res.status(500).json({ success: false, error: "Internal server error while processing trade." });
    }
});



module.exports = router;
