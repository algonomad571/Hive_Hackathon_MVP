import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import axios from "axios";

const API_URL = "https://backend-hivequant.onrender.com/api/investments";
const socket = io("https://backend-hivequant.onrender.com");

const HiveTradingApp = () => {
    const [username, setUsername] = useState("muskan");
    const [asset, setAsset] = useState("HIVE");
    const [tradeLogs, setTradeLogs] = useState([]);

    useEffect(() => {
        socket.on("tradeUpdate", (trade) => {
            setTradeLogs((prevLogs) => [trade, ...prevLogs]);
        });

        return () => {
            socket.off("tradeUpdate");
        };
    }, []);

    const startTrading = async () => {
        try {
            await axios.post(`${API_URL}/start`, { username, asset });
        } catch (error) {
            console.error("Error starting trading:", error);
        }
    };

    const stopTrading = async () => {
        try {
            await axios.post(`${API_URL}/stop`, { username });
        } catch (error) {
            console.error("Error stopping trading:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>📈 Hive Auto-Trading Dashboard</h2>
            <div>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <select value={asset} onChange={(e) => setAsset(e.target.value)}>
                    <option value="HIVE">HIVE</option>
                    <option value="HBD">HBD</option>
                </select>
                <button onClick={startTrading}>Start Trading</button>
                <button onClick={stopTrading}>Stop Trading</button>
            </div>
            <h3>🔍 Trade Logs</h3>
            <ul>
                {tradeLogs.map((trade, index) => (
                    <li key={index}>
                        [{trade.timestamp}] {trade.username} {trade.action} {trade.amount} {trade.asset} @ ${trade.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

ReactDOM.render(<HiveTradingApp />, document.getElementById("root"));
