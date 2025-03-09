const express = require("express");
const { autoTradeHive, autoTradeHBD, stopAutoTrade } = require("../controllers/autoInvestTradingController");
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

// ✅ Route to fetch available frequency options
router.get("/frequencies", (req, res) => {
    return res.json({ success: true, frequencies: frequencyOptions });
});

// ✅ Start auto-trading with the selected frequency
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

        // Run HIVE and HBD trading simultaneously
        const [hiveResult, hbdResult] = await Promise.all([
            autoTradeHive(user, frequency),
            autoTradeHBD(user, frequency)
        ]);

        return res.json({
            success: true,
            message: `✅ Auto-trading started for HIVE and HBD every ${frequency}`,
            hiveResult,
            hbdResult
        });

    } catch (error) {
        console.error(`🚨 Error processing auto-trading:`, error);
        return res.status(500).json({ success: false, error: "Internal server error while processing trade." });
    }
});

// ✅ Stop auto-trading for HIVE and HBD
router.post("/stop", (req, res) => {
    const { user } = req.body;

    if (!user || !user.username) {
        return res.status(400).json({ success: false, error: "Valid user information is required to stop trading." });
    }

    console.log(`🛑 Stopping auto-trading for ${user.username}`);

    const result = stopAutoTrade(user);
    return res.json(result);
});

module.exports = router;
