import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const SERVER_URL = "https://backend-hivequant.onrender.com"; // Change when deploying

// Initialize WebSocket connection
const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"],
});

const AutoTradeMonitor = () => {
  const [tradeData, setTradeData] = useState(null);

  useEffect(() => {
    const handleTradeUpdate = (data) => {
      console.log("📡 Trade Update Received:", data);
      setTradeData(data);
    };

    socket.on("tradeUpdate", handleTradeUpdate);

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket Connection Error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ WebSocket Disconnected:", reason);
    });

    return () => {
      socket.off("tradeUpdate", handleTradeUpdate);
    };
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">📊 Live Hive Trading Updates</h2>
      {tradeData ? (
        <div>
          <p>🔥 <strong>Hive Price:</strong> ${tradeData.hivePrice}</p>
          <p>📈 <strong>Trade Decision:</strong> {tradeData.hiveTrade.tradeDecision}</p>
          <p>💰 <strong>Trade Price:</strong> ${tradeData.hiveTrade.tradePrice.price}</p>
        </div>
      ) : (
        <p className="text-gray-400">No trade updates yet...</p>
      )}
    </div>
  );
};

export default AutoTradeMonitor;
