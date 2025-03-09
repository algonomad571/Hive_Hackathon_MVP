require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config(); // Load environment variables

// Check if MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
const userRoutes = require("./routes/userRoutes");
const investmentRoutes = require("./routes/autoInvestTradingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const hivePriceRoutes = require("./routes/hivePriceRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/users", userRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/hive", hivePriceRoutes);
app.use("/api/profile", profileRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Error handling for undefined routes
app.use((req, res) => {
    console.log('Route not found:', req.method, req.url);
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Binance Trading Config
const { initBinance } = require("./services/binanceService");
const { initTradeConfig } = require("./services/tradeConfigService");

const config = {
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
  BINANCE_API_SECRET: process.env.BINANCE_API_SECRET,
  SYMBOL: "BTCUSDT",
  TRADE_AMOUNT: 0.001,
};

console.log("🔍 Checking Binance API Keys:");
console.log("API Key:", process.env.BINANCE_API_KEY ? "✅ Loaded" : "❌ MISSING");
console.log("API Secret:", process.env.BINANCE_API_SECRET ? "✅ Loaded" : "❌ MISSING");

// Initialize Binance API
initBinance(process.env.BINANCE_API_KEY, process.env.BINANCE_API_SECRET);
initTradeConfig(config);

// Start Server (defined only once)
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello, Render!");
});

console.log('Environment variables loaded:', {
  mongodbUri: process.env.MONGODB_URI ? 'Defined' : 'Undefined',
  port: process.env.PORT
});
