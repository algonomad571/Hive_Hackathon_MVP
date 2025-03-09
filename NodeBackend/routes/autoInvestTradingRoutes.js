const express = require("express");
const { autoTradeHive, autoTradeHBD, stopAutoTrade } = require("../controllers/autoInvestTradingController");
const router = express.Router();

router.post("/trade", async (req, res) => {
    try {
        const { user, frequency } = req.body;

        if (!user || !user.username) {
            return res.status(400).json({ success: false, error: "Valid user information is required." });
        }

        if (!frequency) {
            return res.status(400).json({ success: false, error: "Frequency is required for auto-trading." });
        }

        console.log(`🚀 Auto-trading started for ${user.username} every ${frequency}`);

        // Start auto-trading for HIVE and HBD in parallel
        const hiveTrade = autoTradeHive(user, frequency);
        const hbdTrade = autoTradeHBD(user, frequency);

        await Promise.all([hiveTrade, hbdTrade]);

        return res.json({ success: true, message: `✅ Auto-trading started for HIVE and HBD every ${frequency}` });

    } catch (error) {
        console.error(`🚨 Error processing auto-trading:`, error);
        return res.status(500).json({ success: false, error: "Internal server error while processing trade." });
    }
});

// Stop auto-trading
router.post("/stop", (req, res) => {
    const { user } = req.body;

    if (!user || !user.username) {
        return res.status(400).json({ success: false, error: "Valid user information is required to stop trading." });
    }

    const result = stopAutoTrade(user);
    return res.json(result);
});

module.exports = router;
