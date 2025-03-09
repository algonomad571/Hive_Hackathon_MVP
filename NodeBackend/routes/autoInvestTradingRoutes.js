const express = require("express");
const { startAutoTrading, stopAutoTrade } = require("../controllers/autoInvestTradingRoutes");

const router = express.Router();

// 🟢 Start Simulated Auto Trading
router.post("/start", async (req, res) => {
    try {
        const { username, asset, frequency } = req.body;
        
        if (!username || !asset || !frequency) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await startAutoTrading({ username }, asset, frequency);
        res.json(response);
    } catch (error) {
        console.error("Error starting auto-trade:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🛑 Stop Simulated Auto Trading
router.post("/stop", stopAutoTrade);

module.exports = router;
