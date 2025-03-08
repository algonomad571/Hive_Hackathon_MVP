
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import AiRoboIcon from '../Images/AiRoboIcon.png'

import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();

  // State for crypto holdings
  const [cryptoHoldings, setCryptoHoldings] = useState({
    HIVE: 0.5,
    HBD: 125,
    HP: 86,
  });

  // Dropdown options for AUTO_INVEST
  const dropdownOptions = [
    { name: "Continue AUTO_INVEST.", icon: "⏱️", isPremium: true },
    { name: "for 5 min.", icon: "⏱️", isPremium: true },
    { name: "for 10 min.", icon: "⏱️",isPremium: true },
    { name: "for 15 min.", icon: "⏱️",isPremium: true },
    { name: "for 20 min.", icon: "⏱️" },
    { name: "for 25 min.", icon: "⏱️" },
    { name: "for 30 min.", icon: "⏱️" },
  ];

  const AutoInvestDropdown = () => {
    const [selectedOption, setSelectedOption] = useState("Select Duration ⏳");
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const dropdownOptions = [
      { name: "1 Month", icon: "📅" },
      { name: "3 Months", icon: "📆" },
      { name: "6 Months", icon: "📊" },
      { name: "1 Year", icon: "📈" },
    ];
  
    const handleDropdownSelect = async (option) => {
      setSelectedOption(option.name);
      setDropdownOpen(false);
  
      try {
        const response = await axios.post("http://localhost:3500/api/investment/trade", {
          duration: option.name,
        });
  
        console.log("Server Response:", response.data);
      } catch (error) {
        console.error("Error sending AUTO_INVEST request:", error);
      }
    };
  
    return (
      <div className="relative">
        <button 
          className="bg-gray-800 px-4 py-2 rounded-md w-full text-left"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedOption} ⏳
        </button>
  
        {dropdownOpen && (
          <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-md shadow-lg">
            {dropdownOptions.map((option, index) => (
              <div 
                key={index} 
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleDropdownSelect(option)}
              >
                {option.icon} {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Menu items
  const menuItems = [
    { name: "Dashboard", icon: "□" },
    { name: "Overview", icon: "◫" },
    { name: "AUTO_INVEST", icon: "🤖" },
    { name: "Transactions", icon: "⇄" },
    { name: "Markets", icon: "◎" },
    { name: "Payment", icon: "💳" },
    { name: "Information", icon: "ℹ" },
    { name: "Notifications", icon: "🔔" },
  ];


  // State for profit data
  const [profit] = useState({
    total: 1029.37,
    growth: 8.43,
    months: [
      { month: "Jan", value: 320 },
      { month: "Feb", value: 580 },
      { month: "Mar", value: 420 },
      { month: "Apr", value: 680 },
      { month: "May", value: 380 },
      { month: "Jun", value: 520 },
    ],
  });

  // State for transactions
  const [transactions] = useState([
    { crypto: "HIVE", action: "buy", amount: "+5.00 HIVE", percentage: "+0.89%" },
    { crypto: "HBD", action: "buy", amount: "+0.90 HBD", percentage: "+0.16%" },
    { crypto: "HP", action: "buy", amount: "+2.00 HP", percentage: "+3.09%" },
  ]);

  // State for active menu and dropdown
  const [activeMenu, setActiveMenu] = useState("AUTO_INVEST");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select duration");

  // State for sales chart data
  const [chartData, setChartData] = useState({
    labels: [], // X-axis labels (dates)
    datasets: [
      {
        label: "HIVE",
        data: [],
        borderColor: "#FF4136",
        backgroundColor: "rgba(255, 65, 54, 0.2)",
        tension: 0.4,
      },
      {
        label: "HBD",
        data: [],
        borderColor: "#0074D9",
        backgroundColor: "rgba(0, 116, 217, 0.2)",
        tension: 0.4,
      },
      {
        label: "HP",
        data: [],
        borderColor: "#2ECC40",
        backgroundColor: "rgba(46, 204, 64, 0.2)",
        tension: 0.4,
      },
    ],
  });

  // Fetch real-time data from CoinGecko API
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const hiveResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd"
        );
        const hivePrice = hiveResponse.data.hive.usd;

        const hbdResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=hive_dollar&vs_currencies=usd"
        );
        const hbdPrice = hbdResponse.data.hive_dollar.usd;

        setCryptoHoldings((prevState) => ({
          ...prevState,
          HIVE: hivePrice,
          HBD: hbdPrice,
        }));
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fetch historical data for the sales chart
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const hiveHistoricalResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/hive/market_chart?vs_currency=usd&days=30"
        );
        const hiveHistoricalData = hiveHistoricalResponse.data.prices.map((price) => price[1]);

        const hbdHistoricalResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/hive_dollar/market_chart?vs_currency=usd&days=30"
        );
        const hbdHistoricalData = hbdHistoricalResponse.data.prices.map((price) => price[1]);

        const hpHistoricalData = Array(hiveHistoricalData.length)
          .fill(0)
          .map(() => Math.random() * 10 + 75);

        // Generate labels for the X-axis (dates)
        const labels = hiveHistoricalResponse.data.prices.map((price) =>
          new Date(price[0]).toLocaleDateString()
        );

        setChartData({
          labels,
          datasets: [
            { ...chartData.datasets[0], data: hiveHistoricalData },
            { ...chartData.datasets[1], data: hbdHistoricalData },
            { ...chartData.datasets[2], data: hpHistoricalData },
          ],
        });
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#FFFFFF", // White text for legend
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#374151", // Dark grid lines
        },
        ticks: {
          color: "#9CA3AF", // Gray text for X-axis
        },
      },
      y: {
        grid: {
          color: "#374151", // Dark grid lines
        },
        ticks: {
          color: "#9CA3AF", // Gray text for Y-axis
        },
      },
    },
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
        <div className="flex items-center mb-8">
          <div className="bg-white p-2 rounded">
            <div className="text-black font-bold">◆ ProfitWave</div>
          </div>
        </div>

        <div className="px-2 py-4">
          <div className="relative">
            <input type="text" placeholder="Search" className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm" />
            <span className="absolute left-3 top-2">🔍</span>
          </div>
        </div>

        <div className="mt-6">
          {menuItems.map((item) =>
            item.name === "AUTO_INVEST" ? (
              <div key={item.name} className="relative dropdown-container">
                <div
                  onClick={() => {
                    setActiveMenu("AUTO_INVEST");
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
                    activeMenu === "AUTO_INVEST" ? "bg-gray-800" : "hover:bg-gray-800"
                  }`}
                >
                  <span className="mr-3">
                    <img
                      src={AiRoboIcon || "/placeholder.svg"}
                      alt="AI"
                      className="w-5 h-5"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";
                      }}
                    />
                  </span>
                  <span>AUTO_INVEST</span>
                  <span
                    className="ml-auto transition-transform duration-200"
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▼
                  </span>
                </div>

                {dropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-200 ease-in-out">
                    {dropdownOptions.map((option) => (
                      <div
                        key={option.name}
                        onClick={() => {
                          setSelectedOption(option.name);
                          setDropdownOpen(false);
                        }}
                        className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                      >
                        <span className="mr-3">{option.icon}</span>
                        <span>{option.name}</span>
                        {selectedOption === option.name && <span className="ml-auto text-purple-400">✓</span>}
                        {option.isPremium && (
                          <span className="ml-2 text-xs text-yellow-400">Take Premium</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
                  activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
                {item.name === "Notifications" && (
                  <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
                )}
              </div>
            )
          )}
        </div>

        <div className="mt-auto pt-8 flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
          <span className="ml-3 cursor-pointer" onClick={() => navigate("/profile")}>
            Profile
          </span>
          <span className="ml-auto">⚙️</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <div className="text-gray-400">AUTO_INVEST/</div>
              <div>{selectedOption !== "Select duration" ? selectedOption : "Overview"}</div>
            </div>

            <div className="flex space-x-4">
              <div className="px-3 py-1 bg-gray-800 rounded-md">HIVE: ${cryptoHoldings.HIVE}</div>
              <div className="px-3 py-1 bg-gray-800 rounded-md">HBD: ${cryptoHoldings.HBD}</div>
              <div className="px-3 py-1 bg-gray-800 rounded-md">HP: {cryptoHoldings.HP}</div>
            </div>
          </div>

          {selectedOption !== "Select duration" ? (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                    <img
                      src={AiRoboIcon                         || "/placeholder.svg"}
                      alt="AI"
                      className="w-6 h-6"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AUTO_INVEST is active</h2>
                    <p className="text-gray-400">AI-powered trading {selectedOption}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">Stop</button>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full animate-pulse"
                  style={{
                    width: selectedOption === "for 5 min." ? "60%" : selectedOption === "for 10 min." ? "40%" : "20%",
                  }}
                ></div>
              </div>
              <div className="mt-2 text-right text-sm text-gray-400">
                {selectedOption === "for 5 min."
                  ? "3 minutes remaining"
                  : selectedOption === "for 10 min."
                    ? "6 minutes remaining"
                    : "24 minutes remaining"}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-6">
            {/* Profit Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg">Profit</h2>
                <div className="flex items-center text-sm text-gray-400">
                  <span>6 month</span>
                  <span className="ml-2">□</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
              </div>

              <div className="mt-6 h-40 flex items-end space-x-2">
                {profit.months.map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full rounded-sm bg-purple-700 hover:bg-purple-600"
                      style={{ height: `${data.value / 7}%` }}
                    >
                      {index === 3 && (
                        <div className="text-xs text-center mt-2 text-purple-200">Apr: {profit.growth}%</div>
                      )}
                    </div>
                    <div className="text-xs mt-2 text-gray-400">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg">Transactions</h2>
                <div className="px-2 py-1 text-xs rounded bg-gray-700">All</div>
              </div>

              <div className="mt-4 space-y-4">
                {transactions.map((tx, index) => (
                  <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      {tx.crypto === "Ethereum" && "⬨"}
                      {tx.crypto === "Monero" && "◎"}
                      {tx.crypto === "Tether" && "₮"}
                      {tx.crypto === "Solana" && "≡"}
                    </div>
                    <div>
                      <div>{tx.crypto}</div>
                      <div className="text-xs text-gray-400">{tx.action}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className={tx.action === "buy" ? "text-green-400" : "text-red-400"}>{tx.amount}</div>
                      <div className="text-xs text-gray-400">{tx.percentage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-gray-800 rounded-lg p-6 col-span-2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg">Sales Chart</h2>
                <div className="flex items-center text-sm text-gray-400">
                  <span>08.08.2024</span>
                  <span className="ml-2">□</span>
                </div>
              </div>

              <div className="mt-2 flex space-x-4 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  <span>HIVE</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>HBD</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span>HP</span>
                </div>
              </div>

              <div className="mt-4 h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AIRoboIcon from "../Images/AiRoboIcon.png";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // State for crypto holdings
//   const [cryptoHoldings, setCryptoHoldings] = useState({
//     HIVE: 0.5,
//     HBD: 125,
//     HP: 86,
//   });

//   // State for profit data
//   const [profit] = useState({
//     total: 1029.37,
//     growth: 8.43,
//     months: [
//       { month: "Jan", value: 320 },
//       { month: "Feb", value: 580 },
//       { month: "Mar", value: 420 },
//       { month: "Apr", value: 680 },
//       { month: "May", value: 380 },
//       { month: "Jun", value: 520 },
//     ],
//   });

//   // State for transactions
//   const [transactions] = useState([
//     { crypto: "Ethereum", action: "buy", amount: "+5.00 ETH", percentage: "+0.89%" },
//     { crypto: "Monero", action: "buy", amount: "+0.90 XMR", percentage: "+0.16%" },
//     { crypto: "Tether", action: "buy", amount: "+2500.00 USDT", percentage: "+3.09%" },
//     { crypto: "Solana", action: "sell", amount: "-2.70 SOL", percentage: "-0.08%" },
//   ]);

//   // State for active menu and dropdown
//   const [activeMenu, setActiveMenu] = useState("AUTO_INVEST");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("Select duration");

//   // State for sales chart data
//   const [chartData, setChartData] = useState({
//     labels: [], // X-axis labels (dates)
//     datasets: [
//       {
//         label: "HIVE",
//         data: [],
//         borderColor: "#FF4136",
//         backgroundColor: "rgba(255, 65, 54, 0.2)",
//         tension: 0.4,
//       },
//       {
//         label: "HBD",
//         data: [],
//         borderColor: "#0074D9",
//         backgroundColor: "rgba(0, 116, 217, 0.2)",
//         tension: 0.4,
//       },
//       {
//         label: "HP",
//         data: [],
//         borderColor: "#2ECC40",
//         backgroundColor: "rgba(46, 204, 64, 0.2)",
//         tension: 0.4,
//       },
//     ],
//   });

//   // Fetch real-time data from CoinGecko API
//   useEffect(() => {
//     const fetchCryptoData = async () => {
//       try {
//         const hiveResponse = await axios.get(
//           "https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd"
//         );
//         const hivePrice = hiveResponse.data.hive.usd;

//         const hbdResponse = await axios.get(
//           "https://api.coingecko.com/api/v3/simple/price?ids=hive_dollar&vs_currencies=usd"
//         );
//         const hbdPrice = hbdResponse.data.hive_dollar.usd;

//         setCryptoHoldings((prevState) => ({
//           ...prevState,
//           HIVE: hivePrice,
//           HBD: hbdPrice,
//         }));
//       } catch (error) {
//         console.error("Error fetching crypto data:", error);
//       }
//     };

//     fetchCryptoData();
//     const interval = setInterval(fetchCryptoData, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   // Fetch historical data for the sales chart
//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const hiveHistoricalResponse = await axios.get(
//           "https://api.coingecko.com/api/v3/coins/hive/market_chart?vs_currency=usd&days=30"
//         );
//         const hiveHistoricalData = hiveHistoricalResponse.data.prices.map((price) => price[1]);

//         const hbdHistoricalResponse = await axios.get(
//           "https://api.coingecko.com/api/v3/coins/hive_dollar/market_chart?vs_currency=usd&days=30"
//         );
//         const hbdHistoricalData = hbdHistoricalResponse.data.prices.map((price) => price[1]);

//         const hpHistoricalData = Array(hiveHistoricalData.length)
//           .fill(0)
//           .map(() => Math.random() * 10 + 75);

//         // Generate labels for the X-axis (dates)
//         const labels = hiveHistoricalResponse.data.prices.map((price) =>
//           new Date(price[0]).toLocaleDateString()
//         );

//         setChartData({
//           labels,
//           datasets: [
//             { ...chartData.datasets[0], data: hiveHistoricalData },
//             { ...chartData.datasets[1], data: hbdHistoricalData },
//             { ...chartData.datasets[2], data: hpHistoricalData },
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching historical data:", error);
//       }
//     };

//     fetchHistoricalData();
//   }, []);

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//         labels: {
//           color: "#FFFFFF", // White text for legend
//         },
//       },
//       tooltip: {
//         enabled: true,
//         mode: "index",
//         intersect: false,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           color: "#374151", // Dark grid lines
//         },
//         ticks: {
//           color: "#9CA3AF", // Gray text for X-axis
//         },
//       },
//       y: {
//         grid: {
//           color: "#374151", // Dark grid lines
//         },
//         ticks: {
//           color: "#9CA3AF", // Gray text for Y-axis
//         },
//       },
//     },
//   };

//   return (
//     <div className="flex h-screen w-full bg-gray-900 text-white">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
//         <div className="flex items-center mb-8">
//           <div className="bg-white p-2 rounded">
//             <div className="text-black font-bold">◆ ProfitWave</div>
//           </div>
//         </div>

//         <div className="px-2 py-4">
//           <div className="relative">
//             <input type="text" placeholder="Search" className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm" />
//             <span className="absolute left-3 top-2">🔍</span>
//           </div>
//         </div>

//         <div className="mt-6">
//           {menuItems.map((item) =>
//             item.name === "AUTO_INVEST" ? (
//               <div key={item.name} className="relative dropdown-container">
//                 <div
//                   onClick={() => {
//                     setActiveMenu("AUTO_INVEST");
//                     setDropdownOpen(!dropdownOpen);
//                   }}
//                   className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
//                     activeMenu === "AUTO_INVEST" ? "bg-gray-800" : "hover:bg-gray-800"
//                   }`}
//                 >
//                   <span className="mr-3">
//                     <img
//                       src={AIIconImage || "/placeholder.svg"}
//                       alt="AI"
//                       className="w-5 h-5"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src =
//                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";
//                       }}
//                     />
//                   </span>
//                   <span>AUTO_INVEST</span>
//                   <span
//                     className="ml-auto transition-transform duration-200"
//                     style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
//                   >
//                     ▼
//                   </span>
//                 </div>

//                 {dropdownOpen && (
//                   <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-200 ease-in-out">
//                     {dropdownOptions.map((option) => (
//                       <div
//                         key={option.name}
//                         onClick={() => {
//                           setSelectedOption(option.name);
//                           setDropdownOpen(false);
//                         }}
//                         className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
//                       >
//                         <span className="mr-3">{option.icon}</span>
//                         <span>{option.name}</span>
//                         {selectedOption === option.name && <span className="ml-auto text-purple-400">✓</span>}
//                         {option.isPremium && (
//                           <span className="ml-2 text-xs text-yellow-400">Take Premium</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div
//                 key={item.name}
//                 onClick={() => setActiveMenu(item.name)}
//                 className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
//                   activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
//                 }`}
//               >
//                 <span className="mr-3">{item.icon}</span>
//                 <span>{item.name}</span>
//                 {item.name === "Notifications" && (
//                   <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
//                 )}
//               </div>
//             )
//           )}
//         </div>

//         <div className="mt-auto pt-8 flex items-center">
//           <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
//           <span className="ml-3 cursor-pointer" onClick={() => navigate("/profile")}>
//             Profile
//           </span>
//           <span className="ml-auto">⚙️</span>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex space-x-4">
//               <div className="text-gray-400">AUTO_INVEST/</div>
//               <div>{selectedOption !== "Select duration" ? selectedOption : "Overview"}</div>
//             </div>

//             <div className="flex space-x-4">
//               <div className="px-3 py-1 bg-gray-800 rounded-md">HIVE: ${cryptoHoldings.HIVE}</div>
//               <div className="px-3 py-1 bg-gray-800 rounded-md">HBD: ${cryptoHoldings.HBD}</div>
//               <div className="px-3 py-1 bg-gray-800 rounded-md">HP: {cryptoHoldings.HP}</div>
//             </div>
//           </div>

//           {selectedOption !== "Select duration" ? (
//             <div className="bg-gray-800 rounded-lg p-6 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
//                     <img
//                       src={AIIconImage || "/placeholder.svg"}
//                       alt="AI"
//                       className="w-6 h-6"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src =
//                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";
//                       }}
//                     />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold">AUTO_INVEST is active</h2>
//                     <p className="text-gray-400">AI-powered trading {selectedOption}</p>
//                   </div>
//                 </div>
//                 <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">Stop</button>
//               </div>
//               <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
//                 <div
//                   className="bg-purple-500 h-full rounded-full animate-pulse"
//                   style={{
//                     width: selectedOption === "for 5 min." ? "60%" : selectedOption === "for 10 min." ? "40%" : "20%",
//                   }}
//                 ></div>
//               </div>
//               <div className="mt-2 text-right text-sm text-gray-400">
//                 {selectedOption === "for 5 min."
//                   ? "3 minutes remaining"
//                   : selectedOption === "for 10 min."
//                     ? "6 minutes remaining"
//                     : "24 minutes remaining"}
//               </div>
//             </div>
//           ) : null}

//           <div className="grid grid-cols-2 gap-6">
//             {/* Profit Section */}
//             <div className="bg-gray-800 rounded-lg p-6">
//               <div className="flex justify-between items-center mb-2">
//                 <h2 className="text-lg">Profit</h2>
//                 <div className="flex items-center text-sm text-gray-400">
//                   <span>6 month</span>
//                   <span className="ml-2">□</span>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
//               </div>

//               <div className="mt-6 h-40 flex items-end space-x-2">
//                 {profit.months.map((data, index) => (
//                   <div key={data.month} className="flex flex-col items-center flex-1">
//                     <div
//                       className="w-full rounded-sm bg-purple-700 hover:bg-purple-600"
//                       style={{ height: `${data.value / 7}%` }}
//                     >
//                       {index === 3 && (
//                         <div className="text-xs text-center mt-2 text-purple-200">Apr: {profit.growth}%</div>
//                       )}
//                     </div>
//                     <div className="text-xs mt-2 text-gray-400">{data.month}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Transactions Section */}
//             <div className="bg-gray-800 rounded-lg p-6">
//               <div className="flex justify-between items-center mb-2">
//                 <h2 className="text-lg">Transactions</h2>
//                 <div className="px-2 py-1 text-xs rounded bg-gray-700">All</div>
//               </div>

//               <div className="mt-4 space-y-4">
//                 {transactions.map((tx, index) => (
//                   <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded">
//                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
//                       {tx.crypto === "Ethereum" && "⬨"}
//                       {tx.crypto === "Monero" && "◎"}
//                       {tx.crypto === "Tether" && "₮"}
//                       {tx.crypto === "Solana" && "≡"}
//                     </div>
//                     <div>
//                       <div>{tx.crypto}</div>
//                       <div className="text-xs text-gray-400">{tx.action}</div>
//                     </div>
//                     <div className="ml-auto text-right">
//                       <div className={tx.action === "buy" ? "text-green-400" : "text-red-400"}>{tx.amount}</div>
//                       <div className="text-xs text-gray-400">{tx.percentage}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Sales Chart */}
//             <div className="bg-gray-800 rounded-lg p-6 col-span-2">
//               <div className="flex justify-between items-center mb-2">
//                 <h2 className="text-lg">Sales Chart</h2>
//                 <div className="flex items-center text-sm text-gray-400">
//                   <span>08.08.2024</span>
//                   <span className="ml-2">□</span>
//                 </div>
//               </div>

//               <div className="mt-2 flex space-x-4 text-sm">
//                 <div className="flex items-center">
//                   <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
//                   <span>HIVE</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
//                   <span>HBD</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
//                   <span>HP</span>
//                 </div>
//               </div>

//               <div className="mt-4 h-96">
//                 <Line data={chartData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import AIIconImage from "../Images/AiRoboIcon.png";
// // import axios from "axios";

// // const Dashboard = () => {
// //   const navigate = useNavigate();

  
// //   const [cryptoHoldings, setCryptoHoldings] = useState({
// //     HIVE: 0.5, 
// //     HBD: 125, 
// //     HP: 86, 
// //   });


// //   const [profit] = useState({
// //     total: 1029.37,
// //     growth: 8.43,
// //     months: [
// //       { month: "Jan", value: 320 },
// //       { month: "Feb", value: 580 },
// //       { month: "Mar", value: 420 },
// //       { month: "Apr", value: 680 },
// //       { month: "May", value: 380 },
// //       { month: "Jun", value: 520 },
// //     ],
// //   });

// //   // State for transactions
// //   const [transactions] = useState([
// //     { crypto: "Ethereum", action: "buy", amount: "+5.00 ETH", percentage: "+0.89%" },
// //     { crypto: "Monero", action: "buy", amount: "+0.90 XMR", percentage: "+0.16%" },
// //     { crypto: "Tether", action: "buy", amount: "+2500.00 USDT", percentage: "+3.09%" },
// //     { crypto: "Solana", action: "sell", amount: "-2.70 SOL", percentage: "-0.08%" },
// //   ]);

// //   // State for active menu and dropdown
// //   const [activeMenu, setActiveMenu] = useState("AUTO_INVEST");
// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const [selectedOption, setSelectedOption] = useState("Select duration");

 
// //   const [chartData, setChartData] = useState({
// //     HIVE: [],
// //     HBD: [],
// //     HP: [], 
// //   });

  
// //   const dropdownOptions = [
// //     { name: "for 5 min.", icon: "⏱️" },
// //     { name: "for 10 min.", icon: "⏱️" },
// //     { name: "Continue for upto 30 min.", icon: "⏱️",isPremium: true },
// //   ];

// //   // Menu items
// //   const menuItems = [
// //     { name: "Dashboard", icon: "□" },
// //     { name: "Overview", icon: "◫" },
// //     { name: "AUTO_INVEST", icon: "🤖" },
// //     { name: "Transactions", icon: "⇄" },
// //     { name: "Markets", icon: "◎" },
// //     { name: "Payment", icon: "💳" },
// //     { name: "Information", icon: "ℹ" },
// //     { name: "Notifications", icon: "🔔" },
// //   ];

// //   // Fetch real-time data from CoinGecko API
// //   useEffect(() => {
// //     const fetchCryptoData = async () => {
// //       try {
    
// //         const hiveResponse = await axios.get(
// //           "https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd"
// //         );
// //         const hivePrice = hiveResponse.data.hive.usd;

      
// //         const hbdResponse = await axios.get(
// //           "https://api.coingecko.com/api/v3/simple/price?ids=hive_dollar&vs_currencies=usd"
// //         );
// //         const hbdPrice = hbdResponse.data.hive_dollar.usd;

// //         // Update cryptoHoldings state with real-time prices
// //         setCryptoHoldings((prevState) => ({
// //           ...prevState,
// //           HIVE: hivePrice,
// //           HBD: hbdPrice,
// //           // HP is not available on CoinGecko, so we keep the initial value
// //         }));
// //       } catch (error) {
// //         console.error("Error fetching crypto data:", error);
// //       }
// //     };

    
// //     fetchCryptoData();
// //     const interval = setInterval(fetchCryptoData, 60000);

   
// //     return () => clearInterval(interval);
// //   }, []);


// //   useEffect(() => {
// //     const fetchHistoricalData = async () => {
// //       try {
      
// //         const hiveHistoricalResponse = await axios.get(
// //           "https://api.coingecko.com/api/v3/coins/hive/market_chart?vs_currency=usd&days=30"
// //         );
// //         const hiveHistoricalData = hiveHistoricalResponse.data.prices.map((price) => price[1]);

     
// //         const hbdHistoricalResponse = await axios.get(
// //           "https://api.coingecko.com/api/v3/coins/hive_dollar/market_chart?vs_currency=usd&days=30"
// //         );
// //         const hbdHistoricalData = hbdHistoricalResponse.data.prices.map((price) => price[1]);

        
// //         const hpHistoricalData = Array(hiveHistoricalData.length).fill(0).map(() => 
// //           Math.random() * 10 + 75 // Random value between 75-85
// //         );

// //         setChartData({
// //           HIVE: hiveHistoricalData,
// //           HBD: hbdHistoricalData,
// //           HP: hpHistoricalData,
// //         });
// //       } catch (error) {
// //         console.error("Error fetching historical data:", error);
// //       }
// //     };
    

// //     fetchHistoricalData();
// //   }, []);

// //   // Generate chart path dynamically
// //   const generateChartPath = (data, baseline, variance) => {
// //     let path = "";
// //     const points = data.length > 0 ? data.length : 30;
    
// //     // Use mock data if the real data is empty
// //     const useData = data.length > 0 ? data : Array(30).fill(0).map(() => Math.random() * 20);
    
// //     for (let i = 0; i < points; i++) {
// //       const x = (i / (points - 1)) * 100;
// //       const randomVariance = Math.random() * variance;
// //       const y = baseline - (useData[i] || 0) - randomVariance;
// //       path += `${i === 0 ? "M" : "L"} ${x} ${y}`;
// //     }
// //     return path;
// //   };

// //   return (
// //     <div className="flex w-full bg-gray-900 text-white">
// //       {/* Sidebar */}
// //       <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 fixed h-full top-16">
// //         <div className="flex items-center mb-8">
// //           <div className="bg-white p-2 rounded">
// //             <div className="text-black font-bold">◆ ProfitWave</div>
// //           </div>
// //         </div>

// //         <div className="px-2 py-4">
// //           <div className="relative">
// //             <input type="text" placeholder="Search" className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm" />
// //             <span className="absolute left-3 top-2">🔍</span>
// //           </div>
// //         </div>

// //         <div className="mt-6">
// //           {menuItems.map((item) =>
// //             item.name === "AUTO_INVEST" ? (
// //               <div key={item.name} className="relative dropdown-container">
// //                 <div
// //                   onClick={() => {
// //                     setActiveMenu("AUTO_INVEST");
// //                     setDropdownOpen(!dropdownOpen);
// //                   }}
// //                   className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
// //                     activeMenu === "AUTO_INVEST" ? "bg-gray-800" : "hover:bg-gray-800"
// //                   }`}
// //                 >
// //                   <span className="mr-3">
// //                     <img
// //                       src={AIIconImage || "/placeholder.svg"}
// //                       alt="AI"
// //                       className="w-5 h-5"
// //                       onError={(e) => {
// //                         e.target.onerror = null;
// //                         e.target.src =
// //                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";
// //                       }}
// //                     />
// //                   </span>
// //                   <span>AUTO_INVEST</span>
// //                   <span
// //                     className="ml-auto transition-transform duration-200"
// //                     style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
// //                   >
// //                     ▼
// //                   </span>
// //                 </div>

// //                 {dropdownOpen && (
// //                   <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-200 ease-in-out">
// //                     {dropdownOptions.map((option) => (
// //                       <div
// //                         key={option.name}
// //                         onClick={() => {
// //                           setSelectedOption(option.name);
// //                           setDropdownOpen(false);
// //                         }}
// //                         className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
// //                       >
// //                         <span className="mr-3">{option.icon}</span>
// //                         <span>{option.name}</span>
// //                         {selectedOption === option.name && <span className="ml-auto text-purple-400">✓</span>}
// //                         {option.isPremium && (
// //                           <span className="ml-2 text-xs text-yellow-400">Take Premium</span>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               <div
// //                 key={item.name}
// //                 onClick={() => setActiveMenu(item.name)}
// //                 className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
// //                   activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
// //                 }`}
// //               >
// //                 <span className="mr-3">{item.icon}</span>
// //                 <span>{item.name}</span>
// //                 {item.name === "Notifications" && (
// //                   <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
// //                 )}
// //               </div>
// //             )
// //           )}
// //         </div>

// //         <div className="mt-auto pt-8 flex items-center">
// //           <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
// //           <span className="ml-3 cursor-pointer" onClick={() => navigate("/profile")}>
// //             Profile
// //           </span>
// //           <span className="ml-auto">⚙️</span>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 overflow-auto ml-64">
// //         <div className="p-6">
// //           {/* Header */}
// //           <div className="flex justify-between items-center mb-6">
// //             <div className="flex space-x-4">
// //               <div className="text-gray-400">AUTO_INVEST/</div>
// //               <div>{selectedOption !== "Select duration" ? selectedOption : "Overview"}</div>
// //             </div>

// //             <div className="flex space-x-4">
// //               <div className="px-3 py-1 bg-gray-800 rounded-md">HIVE: ${cryptoHoldings.HIVE}</div>
// //               <div className="px-3 py-1 bg-gray-800 rounded-md">HBD: ${cryptoHoldings.HBD}</div>
// //               <div className="px-3 py-1 bg-gray-800 rounded-md">HP: {cryptoHoldings.HP}</div>
// //             </div>
// //           </div>

// //           {selectedOption !== "Select duration" ? (
// //             <div className="bg-gray-800 rounded-lg p-6 mb-6">
// //               <div className="flex items-center justify-between mb-4">
// //                 <div className="flex items-center">
// //                   <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
// //                     <img
// //                       src={AIIconImage || "/placeholder.svg"}
// //                       alt="AI"
// //                       className="w-6 h-6"
// //                       onError={(e) => {
// //                         e.target.onerror = null;
// //                         e.target.src =
// //                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";
// //                       }}
// //                     />
// //                   </div>
// //                   <div>
// //                     <h2 className="text-xl font-bold">AUTO_INVEST is active</h2>
// //                     <p className="text-gray-400">AI-powered trading {selectedOption}</p>
// //                   </div>
// //                 </div>
// //                 <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">Stop</button>
// //               </div>
// //               <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
// //                 <div
// //                   className="bg-purple-500 h-full rounded-full animate-pulse"
// //                   style={{
// //                     width: selectedOption === "for 5 min." ? "60%" : selectedOption === "for 10 min." ? "40%" : "20%",
// //                   }}
// //                 ></div>
// //               </div>
// //               <div className="mt-2 text-right text-sm text-gray-400">
// //                 {selectedOption === "for 5 min."
// //                   ? "3 minutes remaining"
// //                   : selectedOption === "for 10 min."
// //                     ? "6 minutes remaining"
// //                     : "24 minutes remaining"}
// //               </div>
// //             </div>
// //           ) : null}

// //           <div className="grid grid-cols-2 gap-6">
// //             {/* Profit Section */}
// //             <div className="bg-gray-800 rounded-lg p-6">
// //               <div className="flex justify-between items-center mb-2">
// //                 <h2 className="text-lg">Profit</h2>
// //                 <div className="flex items-center text-sm text-gray-400">
// //                   <span>6 month</span>
// //                   <span className="ml-2">□</span>
// //                 </div>
// //               </div>

// //               <div className="mt-4">
// //                 <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
// //               </div>

// //               <div className="mt-6 h-40 flex items-end space-x-2">
// //                 {profit.months.map((data, index) => (
// //                   <div key={data.month} className="flex flex-col items-center flex-1">
// //                     <div
// //                       className="w-full rounded-sm bg-purple-700 hover:bg-purple-600"
// //                       style={{ height: `${data.value / 7}%` }}
// //                     >
// //                       {index === 3 && (
// //                         <div className="text-xs text-center mt-2 text-purple-200">Apr: {profit.growth}%</div>
// //                       )}
// //                     </div>
// //                     <div className="text-xs mt-2 text-gray-400">{data.month}</div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Transactions Section */}
// //             <div className="bg-gray-800 rounded-lg p-6">
// //               <div className="flex justify-between items-center mb-2">
// //                 <h2 className="text-lg">Transactions</h2>
// //                 <div className="px-2 py-1 text-xs rounded bg-gray-700">All</div>
// //               </div>

// //               <div className="mt-4 space-y-4">
// //                 {transactions.map((tx, index) => (
// //                   <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded">
// //                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
// //                       {tx.crypto === "Ethereum" && "⬨"}
// //                       {tx.crypto === "Monero" && "◎"}
// //                       {tx.crypto === "Tether" && "₮"}
// //                       {tx.crypto === "Solana" && "≡"}
// //                     </div>
// //                     <div>
// //                       <div>{tx.crypto}</div>
// //                       <div className="text-xs text-gray-400">{tx.action}</div>
// //                     </div>
// //                     <div className="ml-auto text-right">
// //                       <div className={tx.action === "buy" ? "text-green-400" : "text-red-400"}>{tx.amount}</div>
// //                       <div className="text-xs text-gray-400">{tx.percentage}</div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Sales Chart */}
// //             <div className="bg-gray-800 rounded-lg p-6 col-span-2">
// //               <div className="flex justify-between items-center mb-2">
// //                 <h2 className="text-lg">Sales chart</h2>
// //                 <div className="flex items-center text-sm text-gray-400">
// //                   <span>08.08.2024</span>
// //                   <span className="ml-2">□</span>
// //                 </div>
// //               </div>

// //               <div className="mt-2 flex space-x-4 text-sm">
// //                 <div className="flex items-center">
// //                   <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
// //                   <span>HIVE</span>
// //                 </div>
// //                 <div className="flex items-center">
// //                   <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
// //                   <span>HBD</span>
// //                 </div>
// //                 <div className="flex items-center">
// //                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
// //                   <span>HP</span>
// //                 </div>
// //               </div>

// //               <div className="mt-4 h-64 w-full relative">
// //                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
// //                   <path
// //                     d={generateChartPath(chartData.HIVE, 90, 10)}
// //                     stroke="#FF4136"
// //                     fill="none"
// //                     strokeWidth="0.5"
// //                   />
// //                   <path
// //                     d={generateChartPath(chartData.HBD, 70, 15)}
// //                     stroke="#0074D9"
// //                     fill="none"
// //                     strokeWidth="0.5"
// //                   />
// //                   <path
// //                     d={generateChartPath(chartData.HP, 50, 12)}
// //                     stroke="#2ECC40"
// //                     fill="none"
// //                     strokeWidth="0.5"
// //                   />

// //                   {/* Highlight point */}
// //                   <circle cx="65" cy="25" r="1.5" fill="#0074D9" />
// //                   <circle cx="65" cy="25" r="0.8" fill="white" />

// //                   {/* Value callout */}
// //                   <text x="68" y="20" fontSize="2.5" fill="white">
// //                     $53,450
// //                   </text>

// //                   <circle cx="55" cy="40" r="1.5" fill="#FF4136" />
// //                   <circle cx="55" cy="40" r="0.8" fill="white" />

// //                   <text x="49" y="36" fontSize="2.5" fill="white">
// //                     $487.40
// //                   </text>
// //                 </svg>

// //                 <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
// //                   {Array.from({ length: 11 }).map((_, i) => (
// //                     <div key={i}>{`${(i * 2).toString()}.00PM`}</div>
// //                   ))}
// //                 </div>

// //                 <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-xs text-gray-400">
// //                   {Array.from({ length: 6 }).map((_, i) => (
// //                     <div key={i}>{`${(5 - i) * 1000 + 2000}`}</div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;






// // // import React, { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();
  
// // //   // Sample data
// // //   const [cryptoHoldings] = useState({
// // //     BTC: 0.5,
// // //     ETH: 125,
// // //     BNB: 86
// // //   });
  
// // //   const [profit] = useState({
// // //     total: 1029.37,
// // //     growth: 8.43,
// // //     months: [
// // //       { month: 'Jan', value: 320 },
// // //       { month: 'Feb', value: 580 },
// // //       { month: 'Mar', value: 420 },
// // //       { month: 'Apr', value: 680 },
// // //       { month: 'May', value: 380 },
// // //       { month: 'Jun', value: 520 }
// // //     ]
// // //   });
  
// // //   const [transactions] = useState([
// // //     { crypto: 'Ethereum', action: 'buy', amount: '+5.00 ETH', percentage: '+0.89%' },
// // //     { crypto: 'Monero', action: 'buy', amount: '+0.90 XMR', percentage: '+0.16%' },
// // //     { crypto: 'Tether', action: 'buy', amount: '+2500.00 USDT', percentage: '+3.09%' },
// // //     { crypto: 'Solana', action: 'sell', amount: '-2.70 SOL', percentage: '-0.08%' }
// // //   ]);
  
// // //   const [activeMenu, setActiveMenu] = useState('Dashboard');
  
// // //   // Menu items
// // //   const menuItems = [
// // //     { name: 'Dashboard', icon: '□' },
// // //     { name: 'Overview', icon: '◫' },
// // //     { name: 'Orders', icon: '☰' },
// // //     { name: 'Transactions', icon: '⇄' },
// // //     { name: 'Markets', icon: '◎' },
// // //     { name: 'Payment', icon: '💳' },
// // //     { name: 'Information', icon: 'ℹ' },
// // //     { name: 'Notifications', icon: '🔔' }
// // //   ];
  
// // //   // Mock data for the chart
// // //   const chartHeight = 200;
// // //   const generateChartPath = (baseline, variance) => {
// // //     let path = '';
// // //     const points = 20;
// // //     for (let i = 0; i < points; i++) {
// // //       const x = (i / (points - 1)) * 100;
// // //       const randomVariance = Math.random() * variance;
// // //       const y = baseline - (i * 3) - randomVariance;
// // //       path += `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
// // //     }
// // //     return path;
// // //   };

// // //   return (
// // //     <div className="flex h-screen w-full bg-gray-900 text-white">
// // //       {/* Sidebar */}
// // //       <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
// // //         <div className="flex items-center mb-8">
// // //           <div className="bg-white p-2 rounded">
// // //             <div className="text-black font-bold">◆ ProfitWave</div>
// // //           </div>
// // //         </div>
        
// // //         <div className="px-2 py-4">
// // //           <div className="relative">
// // //             <input 
// // //               type="text" 
// // //               placeholder="Search" 
// // //               className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm"
// // //             />
// // //             <span className="absolute left-3 top-2">🔍</span>
// // //           </div>
// // //         </div>
        
// // //         <div className="mt-6">
// // //           {menuItems.map(item => (
// // //             <div 
// // //               key={item.name}
// // //               onClick={() => setActiveMenu(item.name)}
// // //               className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
// // //                 activeMenu === item.name ? 'bg-gray-800' : 'hover:bg-gray-800'
// // //               }`}
// // //             >
// // //               <span className="mr-3">{item.icon}</span>
// // //               <span>{item.name}</span>
// // //               {item.name === 'Notifications' && (
// // //                 <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>
        
// // //         <div className="mt-auto pt-8 flex items-center">
// // //           <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
// // //           <span className="ml-3 cursor-pointer" onClick={() => navigate('/profile')}>Profile</span>
// // //           <span className="ml-auto">⚙️</span>
// // //         </div>
// // //       </div>
      
// // //       {/* Main Content */}
// // //       <div className="flex-1 overflow-auto">
// // //         <div className="p-6">
// // //           {/* Header */}
// // //           <div className="flex justify-between items-center mb-6">
// // //             <div className="flex space-x-4">
// // //               <div className="text-gray-400">Dashboard/</div>
// // //               <div>Overview</div>
// // //             </div>
            
// // //             <div className="flex space-x-4">
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">BTC: {cryptoHoldings.BTC}</div>
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">ETH: {cryptoHoldings.ETH}</div>
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">BNB: {cryptoHoldings.BNB}</div>
// // //             </div>
// // //           </div>
          
// // //           <div className="grid grid-cols-2 gap-6">
// // //             {/* Profit Section */}
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Profit</h2>
// // //                 <div className="flex items-center text-sm text-gray-400">
// // //                   <span>6 month</span>
// // //                   <span className="ml-2">□</span>
// // //                 </div>
// // //               </div>
              
// // //               <div className="mt-4">
// // //                 <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
// // //               </div>
              
// // //               <div className="mt-6 h-40 flex items-end space-x-2">
// // //                 {profit.months.map((data, index) => (
// // //                   <div key={data.month} className="flex flex-col items-center flex-1">
// // //                     <div className="w-full rounded-sm bg-purple-700 hover:bg-purple-600" style={{ height: `${data.value / 7}%` }}>
// // //                       {index === 3 && (
// // //                         <div className="text-xs text-center mt-2 text-purple-200">
// // //                           Apr: {profit.growth}%
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                     <div className="text-xs mt-2 text-gray-400">{data.month}</div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
            
// // //             {/* Transactions Section */}
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Transactions</h2>
// // //                 <div className="px-2 py-1 text-xs rounded bg-gray-700">All</div>
// // //               </div>
              
// // //               <div className="mt-4 space-y-4">
// // //                 {transactions.map((tx, index) => (
// // //                   <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded">
// // //                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
// // //                       {tx.crypto === 'Ethereum' && '⬨'}
// // //                       {tx.crypto === 'Monero' && '◎'}
// // //                       {tx.crypto === 'Tether' && '₮'}
// // //                       {tx.crypto === 'Solana' && '≡'}
// // //                     </div>
// // //                     <div>
// // //                       <div>{tx.crypto}</div>
// // //                       <div className="text-xs text-gray-400">{tx.action}</div>
// // //                     </div>
// // //                     <div className="ml-auto text-right">
// // //                       <div className={tx.action === 'buy' ? 'text-green-400' : 'text-red-400'}>
// // //                         {tx.amount}
// // //                       </div>
// // //                       <div className="text-xs text-gray-400">{tx.percentage}</div>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
            
// // //             {/* Sales Chart */}
// // //             <div className="bg-gray-800 rounded-lg p-6 col-span-2">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Sales chart</h2>
// // //                 <div className="flex items-center text-sm text-gray-400">
// // //                   <span>08.08.2024</span>
// // //                   <span className="ml-2">□</span>
// // //                 </div>
// // //               </div>
              
// // //               <div className="mt-2 flex space-x-4 text-sm">
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
// // //                   <span>BTC</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
// // //                   <span>ETH</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
// // //                   <span>BNB</span>
// // //                 </div>
// // //               </div>
              
// // //               <div className="mt-4 h-64 w-full relative">
// // //                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
// // //                   <path d={generateChartPath(90, 10)} stroke="#FF4136" fill="none" strokeWidth="0.5" />
// // //                   <path d={generateChartPath(70, 15)} stroke="#0074D9" fill="none" strokeWidth="0.5" />
// // //                   <path d={generateChartPath(50, 12)} stroke="#2ECC40" fill="none" strokeWidth="0.5" />
                  
// // //                   {/* Highlight point */}
// // //                   <circle cx="65" cy="25" r="1.5" fill="#0074D9" />
// // //                   <circle cx="65" cy="25" r="0.8" fill="white" />
                  
// // //                   {/* Value callout */}
// // //                   <text x="68" y="20" fontSize="2.5" fill="white">$53,450</text>
                  
// // //                   <circle cx="55" cy="40" r="1.5" fill="#FF4136" />
// // //                   <circle cx="55" cy="40" r="0.8" fill="white" />
                  
// // //                   <text x="49" y="36" fontSize="2.5" fill="white">$487.40</text>
// // //                 </svg>
                
// // //                 <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
// // //                   {Array.from({ length: 11 }).map((_, i) => (
// // //                     <div key={i}>{`${(i * 2).toString()}.00PM`}</div>
// // //                   ))}
// // //                 </div>
                
// // //                 <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-xs text-gray-400">
// // //                   {Array.from({ length: 6 }).map((_, i) => (
// // //                     <div key={i}>{`${((5-i) * 1000) + 2000}`}</div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;




// // // import React, { useState } from "react"
// // // import { useNavigate } from "react-router-dom"
// // // import AIIconImage from "../Images/AiIconImage.png"

// // // const Dashboard = () => {
// // //   const navigate = useNavigate()

// // //   // Sample data
// // //   const [cryptoHoldings] = useState({
// // //     BTC: 0.5,
// // //     ETH: 125,
// // //     BNB: 86,
// // //   })

// // //   const [profit] = useState({
// // //     total: 1029.37,
// // //     growth: 8.43,
// // //     months: [
// // //       { month: "Jan", value: 320 },
// // //       { month: "Feb", value: 580 },
// // //       { month: "Mar", value: 420 },
// // //       { month: "Apr", value: 680 },
// // //       { month: "May", value: 380 },
// // //       { month: "Jun", value: 520 },
// // //     ],
// // //   })

// // //   const [transactions] = useState([
// // //     { crypto: "Ethereum", action: "buy", amount: "+5.00 ETH", percentage: "+0.89%" },
// // //     { crypto: "Monero", action: "buy", amount: "+0.90 XMR", percentage: "+0.16%" },
// // //     { crypto: "Tether", action: "buy", amount: "+2500.00 USDT", percentage: "+3.09%" },
// // //     { crypto: "Solana", action: "sell", amount: "-2.70 SOL", percentage: "-0.08%" },
// // //   ])

// // //   const [activeMenu, setActiveMenu] = useState("AUTO_INVEST")
// // //   const [dropdownOpen, setDropdownOpen] = useState(false)
// // //   const [selectedOption, setSelectedOption] = useState("Select duration")

// // //   // Dropdown options for AUTO_INVEST
// // //   const dropdownOptions = [
// // //     { name: "for 5 min.", icon: "⏱️" },
// // //     { name: "for 10 min.", icon: "⏱️" },
// // //     { name: "Continue for upto 30 min.", icon: "⏱️" },
// // //   ]

// // //   // Menu items
// // //   const menuItems = [
// // //     { name: "Dashboard", icon: "□" },
// // //     { name: "Overview", icon: "◫" },
// // //     { name: "AUTO_INVEST", icon: "🤖" },
// // //     { name: "Transactions", icon: "⇄" },
// // //     { name: "Markets", icon: "◎" },
// // //     { name: "Payment", icon: "💳" },
// // //     { name: "Information", icon: "ℹ" },
// // //     { name: "Notifications", icon: "🔔" },
// // //   ]

// // //   // Mock data for the chart
// // //   const chartHeight = 200
// // //   const generateChartPath = (baseline, variance) => {
// // //     let path = ""
// // //     const points = 20
// // //     for (let i = 0; i < points; i++) {
// // //       const x = (i / (points - 1)) * 100
// // //       const randomVariance = Math.random() * variance
// // //       const y = baseline - i * 3 - randomVariance
// // //       path += `${i === 0 ? "M" : "L"} ${x} ${y}`
// // //     }
// // //     return path
// // //   }

// // //   // Add click outside handler
// // //   React.useEffect(() => {
// // //     function handleClickOutside(event) {
// // //       if (dropdownOpen && !event.target.closest(".dropdown-container")) {
// // //         setDropdownOpen(false)
// // //       }
// // //     }

// // //     document.addEventListener("mousedown", handleClickOutside)
// // //     return () => {
// // //       document.removeEventListener("mousedown", handleClickOutside)
// // //     }
// // //   }, [dropdownOpen])

// // //   return (
// // //     <div className="flex h-screen w-full bg-gray-900 text-white">
// // //       {/* Sidebar */}
// // //       <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
// // //         <div className="flex items-center mb-8">
// // //           <div className="bg-white p-2 rounded">
// // //             <div className="text-black font-bold">◆ ProfitWave</div>
// // //           </div>
// // //         </div>

// // //         <div className="px-2 py-4">
// // //           <div className="relative">
// // //             <input type="text" placeholder="Search" className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm" />
// // //             <span className="absolute left-3 top-2">🔍</span>
// // //           </div>
// // //         </div>

// // //         <div className="mt-6">
// // //           {menuItems.map((item) =>
// // //             item.name === "AUTO_INVEST" ? (
// // //               <div key={item.name} className="relative dropdown-container">
// // //                 <div
// // //                   onClick={() => {
// // //                     setActiveMenu("AUTO_INVEST")
// // //                     setDropdownOpen(!dropdownOpen)
// // //                   }}
// // //                   className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
// // //                     activeMenu === "AUTO_INVEST" ? "bg-gray-800" : "hover:bg-gray-800"
// // //                   }`}
// // //                 >
// // //                   <span className="mr-3">
// // //                     <img
// // //                       src={AIIconImage || "/placeholder.svg"}
// // //                       alt="AI"
// // //                       className="w-5 h-5"
// // //                       onError={(e) => {
// // //                         e.target.onerror = null
// // //                         e.target.src =
// // //                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E"
// // //                       }}
// // //                     />
// // //                   </span>
// // //                   <span>AUTO_INVEST</span>
// // //                   <span
// // //                     className="ml-auto transition-transform duration-200"
// // //                     style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
// // //                   >
// // //                     ▼
// // //                   </span>
// // //                 </div>

// // //                 {dropdownOpen && (
// // //                   <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-200 ease-in-out">
// // //                     {dropdownOptions.map((option) => (
// // //                       <div
// // //                         key={option.name}
// // //                         onClick={() => {
// // //                           setSelectedOption(option.name)
// // //                           setDropdownOpen(false)
// // //                         }}
// // //                         className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
// // //                       >
// // //                         <span className="mr-3">{option.icon}</span>
// // //                         <span>{option.name}</span>
// // //                         {selectedOption === option.name && <span className="ml-auto text-purple-400">✓</span>}
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ) : (
// // //               <div
// // //                 key={item.name}
// // //                 onClick={() => setActiveMenu(item.name)}
// // //                 className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
// // //                   activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
// // //                 }`}
// // //               >
// // //                 <span className="mr-3">{item.icon}</span>
// // //                 <span>{item.name}</span>
// // //                 {item.name === "Notifications" && (
// // //                   <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
// // //                 )}
// // //               </div>
// // //             ),
// // //           )}
// // //         </div>

// // //         <div className="mt-auto pt-8 flex items-center">
// // //           <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
// // //           <span className="ml-3 cursor-pointer" onClick={() => navigate("/profile")}>
// // //             Profile
// // //           </span>
// // //           <span className="ml-auto">⚙️</span>
// // //         </div>
// // //       </div>

// // //       {/* Main Content */}
// // //       <div className="flex-1 overflow-auto">
// // //         <div className="p-6">
// // //           {/* Header */}
// // //           <div className="flex justify-between items-center mb-6">
// // //             <div className="flex space-x-4">
// // //               <div className="text-gray-400">AUTO_INVEST/</div>
// // //               <div>{selectedOption !== "Select duration" ? selectedOption : "Overview"}</div>
// // //             </div>

// // //             <div className="flex space-x-4">
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">BTC: {cryptoHoldings.BTC}</div>
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">ETH: {cryptoHoldings.ETH}</div>
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">BNB: {cryptoHoldings.BNB}</div>
// // //             </div>
// // //           </div>

// // //           {selectedOption !== "Select duration" ? (
// // //             <div className="bg-gray-800 rounded-lg p-6 mb-6">
// // //               <div className="flex items-center justify-between mb-4">
// // //                 <div className="flex items-center">
// // //                   <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
// // //                     <img
// // //                       src={AIIconImage || "/placeholder.svg"}
// // //                       alt="AI"
// // //                       className="w-6 h-6"
// // //                       onError={(e) => {
// // //                         e.target.onerror = null
// // //                         e.target.src =
// // //                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E"
// // //                       }}
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <h2 className="text-xl font-bold">AUTO_INVEST is active</h2>
// // //                     <p className="text-gray-400">AI-powered trading {selectedOption}</p>
// // //                   </div>
// // //                 </div>
// // //                 <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">Stop</button>
// // //               </div>
// // //               <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
// // //                 <div
// // //                   className="bg-purple-500 h-full rounded-full animate-pulse"
// // //                   style={{
// // //                     width: selectedOption === "for 5 min." ? "60%" : selectedOption === "for 10 min." ? "40%" : "20%",
// // //                   }}
// // //                 ></div>
// // //               </div>
// // //               <div className="mt-2 text-right text-sm text-gray-400">
// // //                 {selectedOption === "for 5 min."
// // //                   ? "3 minutes remaining"
// // //                   : selectedOption === "for 10 min."
// // //                     ? "6 minutes remaining"
// // //                     : "24 minutes remaining"}
// // //               </div>
// // //             </div>
// // //           ) : null}

// // //           <div className="grid grid-cols-2 gap-6">
// // //             {/* Profit Section */}
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Profit</h2>
// // //                 <div className="flex items-center text-sm text-gray-400">
// // //                   <span>6 month</span>
// // //                   <span className="ml-2">□</span>
// // //                 </div>
// // //               </div>

// // //               <div className="mt-4">
// // //                 <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
// // //               </div>

// // //               <div className="mt-6 h-40 flex items-end space-x-2">
// // //                 {profit.months.map((data, index) => (
// // //                   <div key={data.month} className="flex flex-col items-center flex-1">
// // //                     <div
// // //                       className="w-full rounded-sm bg-purple-700 hover:bg-purple-600"
// // //                       style={{ height: `${data.value / 7}%` }}
// // //                     >
// // //                       {index === 3 && (
// // //                         <div className="text-xs text-center mt-2 text-purple-200">Apr: {profit.growth}%</div>
// // //                       )}
// // //                     </div>
// // //                     <div className="text-xs mt-2 text-gray-400">{data.month}</div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* Transactions Section */}
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Transactions</h2>
// // //                 <div className="px-2 py-1 text-xs rounded bg-gray-700">All</div>
// // //               </div>

// // //               <div className="mt-4 space-y-4">
// // //                 {transactions.map((tx, index) => (
// // //                   <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded">
// // //                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
// // //                       {tx.crypto === "Ethereum" && "⬨"}
// // //                       {tx.crypto === "Monero" && "◎"}
// // //                       {tx.crypto === "Tether" && "₮"}
// // //                       {tx.crypto === "Solana" && "≡"}
// // //                     </div>
// // //                     <div>
// // //                       <div>{tx.crypto}</div>
// // //                       <div className="text-xs text-gray-400">{tx.action}</div>
// // //                     </div>
// // //                     <div className="ml-auto text-right">
// // //                       <div className={tx.action === "buy" ? "text-green-400" : "text-red-400"}>{tx.amount}</div>
// // //                       <div className="text-xs text-gray-400">{tx.percentage}</div>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* Sales Chart */}
// // //             <div className="bg-gray-800 rounded-lg p-6 col-span-2">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Sales chart</h2>
// // //                 <div className="flex items-center text-sm text-gray-400">
// // //                   <span>08.08.2024</span>
// // //                   <span className="ml-2">□</span>
// // //                 </div>
// // //               </div>

// // //               <div className="mt-2 flex space-x-4 text-sm">
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
// // //                   <span>BTC</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
// // //                   <span>ETH</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
// // //                   <span>BNB</span>
// // //                 </div>
// // //               </div>

// // //               <div className="mt-4 h-64 w-full relative">
// // //                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
// // //                   <path d={generateChartPath(90, 10)} stroke="#FF4136" fill="none" strokeWidth="0.5" />
// // //                   <path d={generateChartPath(70, 15)} stroke="#0074D9" fill="none" strokeWidth="0.5" />
// // //                   <path d={generateChartPath(50, 12)} stroke="#2ECC40" fill="none" strokeWidth="0.5" />

// // //                   {/* Highlight point */}
// // //                   <circle cx="65" cy="25" r="1.5" fill="#0074D9" />
// // //                   <circle cx="65" cy="25" r="0.8" fill="white" />

// // //                   {/* Value callout */}
// // //                   <text x="68" y="20" fontSize="2.5" fill="white">
// // //                     $53,450
// // //                   </text>

// // //                   <circle cx="55" cy="40" r="1.5" fill="#FF4136" />
// // //                   <circle cx="55" cy="40" r="0.8" fill="white" />

// // //                   <text x="49" y="36" fontSize="2.5" fill="white">
// // //                     $487.40
// // //                   </text>
// // //                 </svg>

// // //                 <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
// // //                   {Array.from({ length: 11 }).map((_, i) => (
// // //                     <div key={i}>{`${(i * 2).toString()}.00PM`}</div>
// // //                   ))}
// // //                 </div>

// // //                 <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-xs text-gray-400">
// // //                   {Array.from({ length: 6 }).map((_, i) => (
// // //                     <div key={i}>{`${(5 - i) * 1000 + 2000}`}</div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default Dashboard



// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import AIIconImage from "../Images/AiIconImage.png";
// // // import { getBalance, getTransactions, getAutoInvestSettings, toggleAutoInvest, stakeForPremium, checkSubscriptionStatus } from "../APiServices/DashboardApi.js";

// // // const Dashboard= () => {
// // //   const navigate = useNavigate();
// // //   const [cryptoHoldings, setCryptoHoldings] = useState({ BTC: 0.5, ETH: 125, BNB: 86 });
// // //   const [profit, setProfit] = useState({
// // //     total: 1029.37,
// // //     growth: 8.43,
// // //     months: [
// // //       { month: "Jan", value: 320 },
// // //       { month: "Feb", value: 580 },
// // //       { month: "Mar", value: 420 },
// // //       { month: "Apr", value: 680 },
// // //       { month: "May", value: 380 },
// // //       { month: "Jun", value: 520 },
// // //     ],
// // //   });
// // //   const [transactions, setTransactions] = useState([]);
// // //   const [activeMenu, setActiveMenu] = useState("AUTO_INVEST");
// // //   const [dropdownOpen, setDropdownOpen] = useState(false);
// // //   const [selectedOption, setSelectedOption] = useState("Select duration");

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const balanceData = await getBalance();
// // //         const transactionsData = await getTransactions();
// // //         const autoInvestSettings = await getAutoInvestSettings();

// // //         // Update state with fetched data
// // //         setCryptoHoldings(balanceData);
// // //         setTransactions(transactionsData);
// // //         // You can also update other states with autoInvestSettings if needed
// // //       } catch (error) {
// // //         console.error("Error fetching data:", error);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   const handleToggleAutoInvest = async () => {
// // //     try {
// // //       const response = await toggleAutoInvest(true); // or false based on your logic
// // //       console.log("Auto-invest toggled:", response);
// // //     } catch (error) {
// // //       console.error("Error toggling auto-invest:", error);
// // //     }
// // //   };

// // //   const handleStakeForPremium = async () => {
// // //     try {
// // //       const response = await stakeForPremium(10); // Replace with the actual amount
// // //       console.log("Staked for premium:", response);
// // //     } catch (error) {
// // //       console.error("Error staking for premium:", error);
// // //     }
// // //   };

// // //   const handleCheckSubscriptionStatus = async () => {
// // //     try {
// // //       const response = await checkSubscriptionStatus();
// // //       console.log("Subscription status:", response);
// // //     } catch (error) {
// // //       console.error("Error checking subscription status:", error);
// // //     }
// // //   };




  

  

// // //   // Dropdown options for AUTO_INVEST
// // //   const dropdownOptions = [
// // //     { name: "for 5 min.", icon: "⏱️" },
// // //     { name: "for 10 min.", icon: "⏱️" },
// // //     { name: "Continue for upto 30 min.", icon: "⏱️" },
// // //   ]

// // //   // Menu items
// // //   const menuItems = [
// // //     { name: "Dashboard", icon: "□" },
// // //     { name: "Overview", icon: "◫" },
// // //     { name: "AUTO_INVEST", icon: "🤖" },
// // //     { name: "Transactions", icon: "⇄" },
// // //     { name: "Markets", icon: "◎" },
// // //     { name: "Payment", icon: "💳" },
// // //     { name: "Information", icon: "ℹ" },
// // //     { name: "Notifications", icon: "🔔" },
// // //   ]

// // //   // Mock data for the chart
// // //   const chartHeight = 200
// // //   const generateChartPath = (baseline, variance) => {
// // //     let path = ""
// // //     const points = 20
// // //     for (let i = 0; i < points; i++) {
// // //       const x = (i / (points - 1)) * 100
// // //       const randomVariance = Math.random() * variance
// // //       const y = baseline - i * 3 - randomVariance
// // //       path += `${i === 0 ? "M" : "L"} ${x} ${y}`
// // //     }
// // //     return path
// // //   }

// // //   // Add click outside handler
// // //   React.useEffect(() => {
// // //     function handleClickOutside(event) {
// // //       if (dropdownOpen && !event.target.closest(".dropdown-container")) {
// // //         setDropdownOpen(false)
// // //       }
// // //     }

// // //     document.addEventListener("mousedown", handleClickOutside)
// // //     return () => {
// // //       document.removeEventListener("mousedown", handleClickOutside)
// // //     }
// // //   }, [dropdownOpen])

// // //   return (
// // //     <div className="flex h-screen w-full bg-gray-900 text-white">
// // // //       {/* Sidebar */}
// // // //       <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
// // // //         <div className="flex items-center mb-8">
// // // //           <div className="bg-white p-2 rounded">
// // // //             <div className="text-black font-bold">◆ ProfitWave</div>
// // // //           </div>
// // // //         </div>

// // // //         <div className="px-2 py-4">
// // // //           <div className="relative">
// // // //             <input type="text" placeholder="Search" className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm" />
// // // //             <span className="absolute left-3 top-2">🔍</span>
// // // //           </div>
// // // //         </div>

// // // //         <div className="mt-6">
// // // //           {menuItems.map((item) =>
// // //             item.name === "AUTO_INVEST" ? (
// // //               <div key={item.name} className="relative dropdown-container">
// // //                 <div
// // //                   onClick={() => {
// // //                     setActiveMenu("AUTO_INVEST")
// // //                     setDropdownOpen(!dropdownOpen)
// // //                   }}
// // //                   className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
// // //                     activeMenu === "AUTO_INVEST" ? "bg-gray-800" : "hover:bg-gray-800"
// // //                   }`}
// // //                 >
// // //                   <span className="mr-3">
// // //                     <img
// // //                       src={AIIconImage || "/placeholder.svg"}
// // //                       alt="AI"
// // //                       className="w-5 h-5"
// // //                       onError={(e) => {
// // //                         e.target.onerror = null
// // //                         e.target.src =
// // //                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E"
// // //                       }}
// // //                     />
// // //                   </span>
// // //                   <span>AUTO_INVEST</span>
// // //                   <span
// // //                     className="ml-auto transition-transform duration-200"
// // //                     style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
// // //                   >
// // //                     ▼
// // //                   </span>
// // //                 </div>

// // //                 {dropdownOpen && (
// // //                   <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-200 ease-in-out">
// // //                     {dropdownOptions.map((option) => (
// // //                       <div
// // //                         key={option.name}
// // //                         onClick={() => {
// // //                           setSelectedOption(option.name)
// // //                           setDropdownOpen(false)
// // //                         }}
// // //                         className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
// // //                       >
// // //                         <span className="mr-3">{option.icon}</span>
// // //                         <span>{option.name}</span>
// // //                         {selectedOption === option.name && <span className="ml-auto text-purple-400">✓</span>}
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ) : (
// // //               <div
// // //                 key={item.name}
// // //                 onClick={() => setActiveMenu(item.name)}
// // //                 className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
// // //                   activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
// // //                 }`}
// // //               >
// // //                 <span className="mr-3">{item.icon}</span>
// // //                 <span>{item.name}</span>
// // //                 {item.name === "Notifications" && (
// // //                   <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
// // //                 )}
// // //               </div>
// // //             ),
// // //           )}
// // //         </div>

// // //         <div className="mt-auto pt-8 flex items-center">
// // //           <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
// // //           <span className="ml-3 cursor-pointer" onClick={() => navigate("/profile")}>
// // //             Profile
// // //           </span>
// // //           <span className="ml-auto">⚙️</span>
// // //         </div>
// // //       </div>

// // //       {/* Main Content */}
// // //       <div className="flex-1 overflow-auto">
// // //         <div className="p-6">
// // //           {/* Header */}
// // //           <div className="flex justify-between items-center mb-6">
// // //             <div className="flex space-x-4">
// // //               <div className="text-gray-400">AUTO_INVEST/</div>
// // //               <div>{selectedOption !== "Select duration" ? selectedOption : "Overview"}</div>
// // //             </div>

// // //             <div className="flex space-x-4">
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">BTC: {cryptoHoldings.BTC}</div>
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">ETH: {cryptoHoldings.ETH}</div>
// // //               <div className="px-3 py-1 bg-gray-800 rounded-md">BNB: {cryptoHoldings.BNB}</div>
// // //             </div>
// // //           </div>

// // //           {selectedOption !== "Select duration" ? (
// // //             <div className="bg-gray-800 rounded-lg p-6 mb-6">
// // //               <div className="flex items-center justify-between mb-4">
// // //                 <div className="flex items-center">
// // //                   <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
// // //                     <img
// // //                       src={AIIconImage || "/placeholder.svg"}
// // //                       alt="AI"
// // //                       className="w-6 h-6"
// // //                       onError={(e) => {
// // //                         e.target.onerror = null
// // //                         e.target.src =
// // //                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E"
// // //                       }}
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <h2 className="text-xl font-bold">AUTO_INVEST is active</h2>
// // //                     <p className="text-gray-400">AI-powered trading {selectedOption}</p>
// // //                   </div>
// // //                 </div>
// // //                 <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">Stop</button>
// // //               </div>
// // //               <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
// // //                 <div
// // //                   className="bg-purple-500 h-full rounded-full animate-pulse"
// // //                   style={{
// // //                     width: selectedOption === "for 5 min." ? "60%" : selectedOption === "for 10 min." ? "40%" : "20%",
// // //                   }}
// // //                 ></div>
// // //               </div>
// // //               <div className="mt-2 text-right text-sm text-gray-400">
// // //                 {selectedOption === "for 5 min."
// // //                   ? "3 minutes remaining"
// // //                   : selectedOption === "for 10 min."
// // //                     ? "6 minutes remaining"
// // //                     : "24 minutes remaining"}
// // //               </div>
// // //             </div>
// // //           ) : null}

// // //           <div className="grid grid-cols-2 gap-6">
            
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Profit</h2>
// // //                 <div className="flex items-center text-sm text-gray-400">
// // //                   <span>6 month</span>
// // //                   <span className="ml-2">□</span>
// // //                 </div>
// // //               </div>

// // //               <div className="mt-4">
// // //                 <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
// // //               </div>

// // //               <div className="mt-6 h-40 flex items-end space-x-2">
// // //                 {profit.months.map((data, index) => (
// // //                   <div key={data.month} className="flex flex-col items-center flex-1">
// // //                     <div
// // //                       className="w-full rounded-sm bg-purple-700 hover:bg-purple-600"
// // //                       style={{ height: `${data.value / 7}%` }}
// // //                     >
// // //                       {index === 3 && (
// // //                         <div className="text-xs text-center mt-2 text-purple-200">Apr: {profit.growth}%</div>
// // //                       )}
// // //                     </div>
// // //                     <div className="text-xs mt-2 text-gray-400">{data.month}</div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

           
// // //             <div className="bg-gray-800 rounded-lg p-6">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Transactions</h2>
// // //                 <div className="px-2 py-1 text-xs rounded bg-gray-700">All</div>
// // //               </div>

// // //               <div className="mt-4 space-y-4">
// // //                 {transactions.map((tx, index) => (
// // //                   <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded">
// // //                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
// // //                       {tx.crypto === "Ethereum" && "⬨"}
// // //                       {tx.crypto === "Monero" && "◎"}
// // //                       {tx.crypto === "Tether" && "₮"}
// // //                       {tx.crypto === "Solana" && "≡"}
// // //                     </div>
// // //                     <div>
// // //                       <div>{tx.crypto}</div>
// // //                       <div className="text-xs text-gray-400">{tx.action}</div>
// // //                     </div>
// // //                     <div className="ml-auto text-right">
// // //                       <div className={tx.action === "buy" ? "text-green-400" : "text-red-400"}>{tx.amount}</div>
// // //                       <div className="text-xs text-gray-400">{tx.percentage}</div>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* Sales Chart */}
// // //             <div className="bg-gray-800 rounded-lg p-6 col-span-2">
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <h2 className="text-lg">Sales chart</h2>
// // //                 <div className="flex items-center text-sm text-gray-400">
// // //                   <span>08.08.2024</span>
// // //                   <span className="ml-2">□</span>
// // //                 </div>
// // //               </div>

// // //               <div className="mt-2 flex space-x-4 text-sm">
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
// // //                   <span>BTC</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
// // //                   <span>ETH</span>
// // //                 </div>
// // //                 <div className="flex items-center">
// // //                   <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
// // //                   <span>BNB</span>
// // //                 </div>
// // //               </div>

// // //               <div className="mt-4 h-64 w-full relative">
// // //                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
// // //                   <path d={generateChartPath(90, 10)} stroke="#FF4136" fill="none" strokeWidth="0.5" />
// // //                   <path d={generateChartPath(70, 15)} stroke="#0074D9" fill="none" strokeWidth="0.5" />
// // //                   <path d={generateChartPath(50, 12)} stroke="#2ECC40" fill="none" strokeWidth="0.5" />

                 
// // //                   <circle cx="65" cy="25" r="1.5" fill="#0074D9" />
// // //                   <circle cx="65" cy="25" r="0.8" fill="white" />

                
// // //                   <text x="68" y="20" fontSize="2.5" fill="white">
// // //                     $53,450
// // //                   </text>

// // //                   <circle cx="55" cy="40" r="1.5" fill="#FF4136" />
// // //                   <circle cx="55" cy="40" r="0.8" fill="white" />

// // //                   <text x="49" y="36" fontSize="2.5" fill="white">
// // //                     $487.40
// // //                   </text>
// // //                 </svg>

// // //                 <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
// // //                   {Array.from({ length: 11 }).map((_, i) => (
// // //                     <div key={i}>{`${(i * 2).toString()}.00PM`}</div>
// // //                   ))}
// // //                 </div>

// // //                 <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-xs text-gray-400">
// // //                   {Array.from({ length: 6 }).map((_, i) => (
// // //                     <div key={i}>{`${(5 - i) * 1000 + 2000}`}</div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
  
                
// // //   );
// // // };

// // // export default Dashboard;



