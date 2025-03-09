const express = require("express");
const { startAutoTrading, stopAutoTrade } = require("../controllers/autoInvestTradingController");

const router = express.Router();

// 🟢 Start Auto Trading (Reads from Hive)
router.post("/start", async (req, res) => {
    try {
        const { username, asset } = req.body;

        if (!username || !asset) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await startAutoTrading({ username }, asset);
        res.json(response);
    } catch (error) {
        console.error("Error starting auto-trade:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🛑 Stop Auto Trading
router.post("/stop", stopAutoTrade);

module.exports = router;
