const dhive = require("dhive");

// Hive nodes (public RPC endpoints)
const client = new dhive.Client([
    "https://api.hive.blog",
    "https://anyx.io",
    "https://api.openhive.network"
]);

// 📌 Get User Balance (HIVE / HBD)
const getUserBalance = async (username, asset) => {
    try {
        const accounts = await client.database.getAccounts([username]);
        if (!accounts || accounts.length === 0) return 0;

        let balance = 0;
        if (asset === "HIVE") {
            balance = parseFloat(accounts[0].balance.split(" ")[0]); // Extract HIVE balance
        } else if (asset === "HBD") {
            balance = parseFloat(accounts[0].hbd_balance.split(" ")[0]); // Extract HBD balance
        }

        return balance;
    } catch (error) {
        console.error(`❌ Error fetching balance for ${username}:`, error);
        return 0;
    }
};

// 📌 Fetch live market prices for Hive & HBD
const getHivePrice = async () => {
    try {
        const price = await client.database.getCurrentMedianHistoryPrice();
        return parseFloat(price.base.split(" ")[0]); // Extract price value
    } catch (error) {
        console.error("❌ Error fetching Hive price:", error);
        return null;
    }
};

const getHBDPrice = async () => {
    try {
        const price = await client.database.getCurrentMedianHistoryPrice();
        return parseFloat(price.quote.split(" ")[0]); // Extract price value
    } catch (error) {
        console.error("❌ Error fetching HBD price:", error);
        return null;
    }
};

module.exports = { getUserBalance, getHivePrice, getHBDPrice };
