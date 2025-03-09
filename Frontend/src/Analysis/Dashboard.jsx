import { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import {
  Search,
  Settings,
  Home,
  BarChart2,
  BotIcon as Robot,
  CreditCard,
  Info,
  Bell,
  ChevronDown,
  X,
  Plus,
} from "lucide-react"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const Dashboard = () => {
  // State for crypto holdings
  const [cryptoHoldings, setCryptoHoldings] = useState({
    HIVE: 0.5,
    HBD: 125,
    HP: 86,
  })

  // Dropdown options for AUTO_INVEST
  const dropdownOptions = [
    { name: "Continue AUTO_INVEST.", icon: "⏱️", isPremium: true },
    { name: "for 5 min.", icon: "⏱️", isPremium: true },
    { name: "for 10 min.", icon: "⏱️", isPremium: true },
    { name: "for 15 min.", icon: "⏱️", isPremium: true },
    { name: "for 20 min.", icon: "⏱️" },
    { name: "for 25 min.", icon: "⏱️" },
    { name: "for 30 min.", icon: "⏱️" },
  ]

  // State for active menu and dropdown
  const [activeMenu, setActiveMenu] = useState("AUTO_INVEST")
  const [selectedOption, setSelectedOption] = useState("Select duration")
  const [isInvesting, setIsInvesting] = useState(false)

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
  })

  // State for transactions
  const [transactions] = useState([
    { crypto: "HIVE", action: "buy", amount: "+5.00 HIVE", percentage: "+0.89%" },
    { crypto: "HBD", action: "buy", amount: "+0.90 HBD", percentage: "+0.16%" },
    { crypto: "HP", action: "buy", amount: "+2.00 HP", percentage: "+3.09%" },
  ])

  // State for sales chart data
  const [chartData, setChartData] = useState({
    labels: [], // X-axis labels (dates)
    datasets: [
      {
        label: "HIVE",
        data: [],
        borderColor: "#FF4136",
        backgroundColor: "rgba(255, 65, 54, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
      {
        label: "HBD",
        data: [],
        borderColor: "#0074D9",
        backgroundColor: "rgba(0, 116, 217, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
      {
        label: "HP",
        data: [],
        borderColor: "#2ECC40",
        backgroundColor: "rgba(46, 204, 64, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
    ],
  })

  // Add this state for the AUTO_INVEST dropdown in the sidebar
  const [showAutoInvestDropdown, setShowAutoInvestDropdown] = useState(false)

  // Menu items
  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, onClick: () => setActiveMenu("Dashboard") },
    { name: "Overview", icon: <BarChart2 size={18} />, onClick: () => setActiveMenu("Overview") },
    {
      name: "AUTO_INVEST",
      icon: <Robot size={18} />,
      onClick: () => setShowAutoInvestDropdown(!showAutoInvestDropdown),
      hasDropdown: true,
    },
    { name: "Payment", icon: <CreditCard size={18} />, onClick: () => setActiveMenu("Payment") },
    { name: "Information", icon: <Info size={18} />, onClick: () => setActiveMenu("Information") },
    { name: "Notifications", icon: <Bell size={18} />, onClick: () => setActiveMenu("Notifications") },
    { name: "AI_Simulator", icon: <Robot size={18} />, onClick: () => console.log("Navigate to AI Simulator") },
  ]

  // Add these sidebar dropdown options
  const sidebarDropdownOptions = [
    { name: "Continue investment", isPremium: true },
    { name: "for 5 min", isPremium: true },
    { name: "for 10 min", isPremium: true },
    { name: "for 15 minutes", isPremium: false },
    { name: "for 20 minutes"},
    { name: "for 25 minutes"},
    { name: "for 30 minutes"},
  ]

  const AutoInvestDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleDropdownSelect = async (option) => {
      setSelectedOption(option.name)
      setDropdownOpen(false)
      setIsInvesting(true)

      try {
        const response = await axios.post("http://localhost:3500/api/investment/trade", {
          duration: option.name,
        })

        console.log("Server Response:", response.data)
      } catch (error) {
        console.error("Error sending AUTO_INVEST request:", error)
      }
    }

    return (
      <div className="relative">
        <button
          className="bg-gray-800 px-4 py-2 rounded-md w-full text-left flex justify-between items-center"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{selectedOption}</span>
          <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-md shadow-lg z-10">
            {dropdownOptions.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                onClick={() => handleDropdownSelect(option)}
              >
                <span className="mr-2">{option.icon}</span>
                <span>{option.name}</span>
                {option.isPremium && <span className="ml-auto text-xs bg-purple-600 px-2 py-0.5 rounded">PRO</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Fetch real-time data from CoinGecko API
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const hiveResponse = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd")
        const hivePrice = hiveResponse.data.hive.usd

        const hbdResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=hive_dollar&vs_currencies=usd",
        )
        const hbdPrice = hbdResponse.data.hive_dollar.usd

        setCryptoHoldings((prevState) => ({
          ...prevState,
          HIVE: hivePrice,
          HBD: hbdPrice,
        }))
      } catch (error) {
        console.error("Error fetching crypto data:", error)
        // Use fallback data if API fails
        setCryptoHoldings({
          HIVE: 0.5,
          HBD: 125,
          HP: 86,
        })
      }
    }

    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 60000)

    return () => clearInterval(interval)
  }, [])

  // Generate mock historical data for the sales chart
  useEffect(() => {
    const generateMockData = () => {
      // Generate 30 days of data
      const days = 30
      const labels = Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - i - 1))
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      })

      // Generate realistic looking data with trends
      const hiveData = []
      const hbdData = []
      const hpData = []

      // Starting values
      let hive = 0.5
      let hbd = 1.0
      let hp = 80

      for (let i = 0; i < days; i++) {
        // Add some randomness but maintain a trend
        hive = hive + (Math.random() * 0.1 - 0.05) + (i > 15 ? 0.01 : -0.005)
        hbd = hbd + (Math.random() * 0.05 - 0.025) + 0.002
        hp = hp + (Math.random() * 3 - 1.5) + (i > 20 ? 0.5 : -0.2)

        // Ensure values stay positive
        hive = Math.max(0.3, hive)
        hbd = Math.max(0.8, hbd)
        hp = Math.max(70, hp)

        hiveData.push(hive)
        hbdData.push(hbd)
        hpData.push(hp)
      }

      setChartData({
        labels,
        datasets: [
          { ...chartData.datasets[0], data: hiveData },
          { ...chartData.datasets[1], data: hbdData },
          { ...chartData.datasets[2], data: hpData },
        ],
      })
    }

    generateMockData()
  }, [])

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#FFFFFF",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "#FFFFFF",
        bodyColor: "#E5E7EB",
        borderColor: "#4B5563",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label +=
                context.dataset.label === "HIVE" || context.dataset.label === "HBD"
                  ? "$" + context.parsed.y.toFixed(2)
                  : context.parsed.y.toFixed(2)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(55, 65, 81, 0.3)",
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          maxRotation: 0,
          font: {
            size: 10,
          },
          callback: function (val, index) {
            // Show fewer labels on x-axis for better readability
            return index % 3 === 0 ? this.getLabelForValue(val) : ""
          },
        },
      },
      y: {
        grid: {
          color: "rgba(55, 65, 81, 0.3)",
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 10,
          },
          padding: 10,
        },
        beginAtZero: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 2,
      },
    },
  }

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="bg-white p-2 rounded">
            <div className="text-black font-bold">◆ ProfitWave</div>
          </div>
        </div>

        <div className="px-2 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="mt-6 flex-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              <div
                onClick={item.onClick}
                className={`flex items-center p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                  activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
                {item.name === "Notifications" && (
                  <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
                )}
                {item.hasDropdown && (
                  <ChevronDown
                    className={`ml-auto h-4 w-4 transition-transform ${showAutoInvestDropdown ? "rotate-180" : ""}`}
                  />
                )}
              </div>

              {item.hasDropdown && showAutoInvestDropdown && (
                <div className="ml-8 mb-2 bg-gray-800 rounded-md overflow-hidden">
                  {sidebarDropdownOptions.map((option, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                      onClick={() => {
                        setSelectedOption(option.name)
                        setIsInvesting(true)
                        setShowAutoInvestDropdown(false)
                        setActiveMenu("AUTO_INVEST")
                      }}
                    >
                      <span>{option.name}</span>
                      {option.isPremium && (
                        <span className="text-xs bg-green-600 text-green-100 px-2 py-0.5 rounded">PREMIUM</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
          <span className="ml-3 cursor-pointer">Profile</span>
          <Settings className="ml-auto h-4 w-4 text-gray-400" />
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
              <div className="px-3 py-1 bg-gray-800 rounded-md">
                HIVE: ${typeof cryptoHoldings.HIVE === "number" ? cryptoHoldings.HIVE.toFixed(2) : cryptoHoldings.HIVE}
              </div>
              <div className="px-3 py-1 bg-gray-800 rounded-md">
                HBD: ${typeof cryptoHoldings.HBD === "number" ? cryptoHoldings.HBD.toFixed(2) : cryptoHoldings.HBD}
              </div>
              <div className="px-3 py-1 bg-gray-800 rounded-md">HP: {cryptoHoldings.HP}</div>
            </div>
          </div>

          {/* AUTO_INVEST Status */}
          {isInvesting && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                    <Robot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AUTO_INVEST is started</h2>
                    <p className="text-gray-400">
{/*                         {selectedOption.includes("5 min")
                        ? "Bot is investing for 5 minutes"
                        : selectedOption.includes("10 min")
                          ? "Bot is investing for 10 minutes"
                          : selectedOption.includes("15 min")
                            ? "Bot is investing for 15 minutes"
                            : "Bot is investing"} */}

{
  selectedOption.includes("5 min")
    ? "Bot is investing for 5 minutes"
    : selectedOption.includes("10 min")
      ? "Bot is investing for 10 minutes"
      : selectedOption.includes("15 min")
        ? "Bot is investing for 15 minutes"
        : selectedOption.includes("20 min")
          ? "Bot is investing for 20 minutes"
          : selectedOption.includes("25 min")
            ? "Bot is investing for 25 minutes"
            : selectedOption.includes("30 min")
              ? "Bot is investing for 30 minutes"
              : selectedOption.includes("Continue investment")
                ? "Bot is investing continuously"
                : "Bot is investing"
  
}

                      
                    </p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors flex items-center"
                  onClick={() => setIsInvesting(false)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Stop
                </button>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full animate-pulse"
                  style={{
                    width: selectedOption.includes("5 min")
                      ? "60%"
                      : selectedOption.includes("10 min")
                        ? "40%"
                        : selectedOption.includes("15 min")
                          ? "20%"
                          : "50%",
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Profit Section */}
            <div className="bg-gray-800 rounded-lg p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Profit</h2>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
                    Daily
                  </div>
                  <div className="px-2 py-1 text-xs rounded bg-purple-700 cursor-pointer">Monthly</div>
                  <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
                    Yearly
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <div>
                  <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-green-400">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span>{profit.growth}%</span>
                    </div>
                    <span className="text-gray-400 text-sm ml-2">vs last period</span>
                  </div>
                </div>
                <div className="ml-auto px-3 py-1 bg-purple-900/30 rounded-md text-purple-300 text-sm">
                  +$45.32 today
                </div>
              </div>

              <div className="mt-6 h-40 flex items-end space-x-2">
                {profit.months.map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center flex-1 group">
                    <div
                      className="w-full rounded-sm bg-gradient-to-t from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 transition-colors relative"
                      style={{ height: `${data.value / 7}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${data.value.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-xs mt-2 text-gray-400">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Transactions</h2>
                <div className="flex space-x-2">
                  <div className="px-2 py-1 text-xs rounded bg-purple-700 cursor-pointer">All</div>
                  <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
                    Buy
                  </div>
                  <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
                    Sell
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {transactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mr-3 text-white font-medium">
                      {tx.crypto.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{tx.crypto}</div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${tx.action === "buy" ? "bg-green-400" : "bg-red-400"} mr-1`}
                        ></span>
                        {tx.action.charAt(0).toUpperCase() + tx.action.slice(1)}
                        <span className="text-gray-500 mx-1">•</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className={`font-medium ${tx.action === "buy" ? "text-green-400" : "text-red-400"}`}>
                        {tx.amount}
                      </div>
                      <div className="text-xs text-gray-400">{tx.percentage}</div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-4 py-2 rounded-md border border-dashed border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm flex items-center justify-center">
                  <Plus size={16} className="mr-1" />
                  View All Transactions
                </button>
              </div>
            </div>

            {/* Sales Chart - Improved */}
            <div className="bg-gray-800 rounded-lg p-6 col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Sales Chart</h2>
                <div className="flex space-x-4">
                  <AutoInvestDropdown />
                  <div className="flex items-center text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-md">
                    <span>08.08.2024</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="mt-2 flex space-x-6 text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span>HIVE</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  <span>HBD</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span>HP</span>
                </div>
              </div>

              <div className="mt-6 h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard




// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Line } from "react-chartjs-2"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js"
// import {
//   Search,
//   Settings,
//   Home,
//   BarChart2,
//   BotIcon as Robot,
//   CreditCard,
//   Info,
//   Bell,
//   ChevronDown,
//   X,
//   Plus,
// } from "lucide-react"

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// const Dashboard = () => {
//   // State for crypto holdings
//   const [cryptoHoldings, setCryptoHoldings] = useState({
//     HIVE: 0.5,
//     HBD: 125,
//     HP: 86,
//   })

//   // Dropdown options for AUTO_INVEST
//   const dropdownOptions = [
//     { name: "Continue AUTO_INVEST.", icon: "⏱️", isPremium: true },
//     { name: "for 5 min.", icon: "⏱️", isPremium: true },
//     { name: "for 10 min.", icon: "⏱️", isPremium: true },
//     { name: "for 15 min.", icon: "⏱️", isPremium: true },
//     { name: "for 20 min.", icon: "⏱️" },
//     { name: "for 25 min.", icon: "⏱️" },
//     { name: "for 30 min.", icon: "⏱️" },
//   ]

//   // State for active menu and dropdown
//   const [activeMenu, setActiveMenu] = useState("AUTO_INVEST")
//   const [selectedOption, setSelectedOption] = useState("Select duration")
//   const [isInvesting, setIsInvesting] = useState(false)

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
//   })

//   // State for transactions
//   const [transactions] = useState([
//     { crypto: "HIVE", action: "buy", amount: "+5.00 HIVE", percentage: "+0.89%" },
//     { crypto: "HBD", action: "buy", amount: "+0.90 HBD", percentage: "+0.16%" },
//     { crypto: "HP", action: "buy", amount: "+2.00 HP", percentage: "+3.09%" },
//   ])

//   // State for sales chart data
//   const [chartData, setChartData] = useState({
//     labels: [], // X-axis labels (dates)
//     datasets: [
//       {
//         label: "HIVE",
//         data: [],
//         borderColor: "#FF4136",
//         backgroundColor: "rgba(255, 65, 54, 0.1)",
//         tension: 0.4,
//         fill: true,
//         borderWidth: 2,
//       },
//       {
//         label: "HBD",
//         data: [],
//         borderColor: "#0074D9",
//         backgroundColor: "rgba(0, 116, 217, 0.1)",
//         tension: 0.4,
//         fill: true,
//         borderWidth: 2,
//       },
//       {
//         label: "HP",
//         data: [],
//         borderColor: "#2ECC40",
//         backgroundColor: "rgba(46, 204, 64, 0.1)",
//         tension: 0.4,
//         fill: true,
//         borderWidth: 2,
//       },
//     ],
//   })

//   // Add this state for the AUTO_INVEST dropdown in the sidebar
//   const [showAutoInvestDropdown, setShowAutoInvestDropdown] = useState(false)

//   // Menu items
//   const menuItems = [
//     { name: "Dashboard", icon: <Home size={18} />, onClick: () => setActiveMenu("Dashboard") },
//     { name: "Overview", icon: <BarChart2 size={18} />, onClick: () => setActiveMenu("Overview") },
//     {
//       name: "AUTO_INVEST",
//       icon: <Robot size={18} />,
//       onClick: () => setShowAutoInvestDropdown(!showAutoInvestDropdown),
//       hasDropdown: true,
//     },
//     { name: "Payment", icon: <CreditCard size={18} />, onClick: () => setActiveMenu("Payment") },
//     { name: "Information", icon: <Info size={18} />, onClick: () => setActiveMenu("Information") },
//     { name: "Notifications", icon: <Bell size={18} />, onClick: () => setActiveMenu("Notifications") },
//     { name: "AI_Simulator", icon: <Robot size={18} />, onClick: () => console.log("Navigate to AI Simulator") },
//   ]

//   // Add these sidebar dropdown options
//   const sidebarDropdownOptions = [
//     { name: "Continue investment", isPremium: true },
//     { name: "for 5 min", isPremium: true },
//     { name: "for 10 min", isPremium: true },
//     { name: "for 15 minutes", isPremium: false },
//   ]

//   const AutoInvestDropdown = () => {
//     const [dropdownOpen, setDropdownOpen] = useState(false)

//     const handleDropdownSelect = async (option) => {
//       setSelectedOption(option.name)
//       setDropdownOpen(false)
//       setIsInvesting(true)

//       try {
//         const response = await axios.post("http://localhost:3500/api/investment/trade", {
//           duration: option.name,
//         })

//         console.log("Server Response:", response.data)
//       } catch (error) {
//         console.error("Error sending AUTO_INVEST request:", error)
//       }
//     }

//     return (
//       <div className="relative">
//         <button
//           className="bg-gray-800 px-4 py-2 rounded-md w-full text-left flex justify-between items-center"
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//         >
//           <span>{selectedOption}</span>
//           <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
//         </button>

//         {dropdownOpen && (
//           <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-md shadow-lg z-10">
//             {dropdownOptions.map((option, index) => (
//               <div
//                 key={index}
//                 className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
//                 onClick={() => handleDropdownSelect(option)}
//               >
//                 <span className="mr-2">{option.icon}</span>
//                 <span>{option.name}</span>
//                 {option.isPremium && <span className="ml-auto text-xs bg-purple-600 px-2 py-0.5 rounded">PRO</span>}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   // Fetch real-time data from CoinGecko API
//   useEffect(() => {
//     const fetchCryptoData = async () => {
//       try {
//         const hiveResponse = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd")
//         const hivePrice = hiveResponse.data.hive.usd

//         const hbdResponse = await axios.get(
//           "https://api.coingecko.com/api/v3/simple/price?ids=hive_dollar&vs_currencies=usd",
//         )
//         const hbdPrice = hbdResponse.data.hive_dollar.usd

//         setCryptoHoldings((prevState) => ({
//           ...prevState,
//           HIVE: hivePrice,
//           HBD: hbdPrice,
//         }))
//       } catch (error) {
//         console.error("Error fetching crypto data:", error)
//         // Use fallback data if API fails
//         setCryptoHoldings({
//           HIVE: 0.5,
//           HBD: 125,
//           HP: 86,
//         })
//       }
//     }

//     fetchCryptoData()
//     const interval = setInterval(fetchCryptoData, 60000)

//     return () => clearInterval(interval)
//   }, [])

//   // Generate mock historical data for the sales chart
//   useEffect(() => {
//     const generateMockData = () => {
//       // Generate 30 days of data
//       const days = 30
//       const labels = Array.from({ length: days }, (_, i) => {
//         const date = new Date()
//         date.setDate(date.getDate() - (days - i - 1))
//         return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
//       })

//       // Generate realistic looking data with trends
//       const hiveData = []
//       const hbdData = []
//       const hpData = []

//       // Starting values
//       let hive = 0.5
//       let hbd = 1.0
//       let hp = 80

//       for (let i = 0; i < days; i++) {
//         // Add some randomness but maintain a trend
//         hive = hive + (Math.random() * 0.1 - 0.05) + (i > 15 ? 0.01 : -0.005)
//         hbd = hbd + (Math.random() * 0.05 - 0.025) + 0.002
//         hp = hp + (Math.random() * 3 - 1.5) + (i > 20 ? 0.5 : -0.2)

//         // Ensure values stay positive
//         hive = Math.max(0.3, hive)
//         hbd = Math.max(0.8, hbd)
//         hp = Math.max(70, hp)

//         hiveData.push(hive)
//         hbdData.push(hbd)
//         hpData.push(hp)
//       }

//       setChartData({
//         labels,
//         datasets: [
//           { ...chartData.datasets[0], data: hiveData },
//           { ...chartData.datasets[1], data: hbdData },
//           { ...chartData.datasets[2], data: hpData },
//         ],
//       })
//     }

//     generateMockData()
//   }, [])

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       mode: "index",
//       intersect: false,
//     },
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//         labels: {
//           color: "#FFFFFF",
//           usePointStyle: true,
//           pointStyle: "circle",
//           padding: 20,
//           font: {
//             size: 12,
//           },
//         },
//       },
//       tooltip: {
//         enabled: true,
//         mode: "index",
//         intersect: false,
//         backgroundColor: "rgba(17, 24, 39, 0.9)",
//         titleColor: "#FFFFFF",
//         bodyColor: "#E5E7EB",
//         borderColor: "#4B5563",
//         borderWidth: 1,
//         padding: 12,
//         cornerRadius: 4,
//         displayColors: true,
//         boxPadding: 4,
//         callbacks: {
//           label: (context) => {
//             let label = context.dataset.label || ""
//             if (label) {
//               label += ": "
//             }
//             if (context.parsed.y !== null) {
//               label +=
//                 context.dataset.label === "HIVE" || context.dataset.label === "HBD"
//                   ? "$" + context.parsed.y.toFixed(2)
//                   : context.parsed.y.toFixed(2)
//             }
//             return label
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           color: "rgba(55, 65, 81, 0.3)",
//           drawBorder: false,
//         },
//         ticks: {
//           color: "#9CA3AF",
//           maxRotation: 0,
//           font: {
//             size: 10,
//           },
//           callback: function (val, index) {
//             // Show fewer labels on x-axis for better readability
//             return index % 3 === 0 ? this.getLabelForValue(val) : ""
//           },
//         },
//       },
//       y: {
//         grid: {
//           color: "rgba(55, 65, 81, 0.3)",
//           drawBorder: false,
//         },
//         ticks: {
//           color: "#9CA3AF",
//           font: {
//             size: 10,
//           },
//           padding: 10,
//         },
//         beginAtZero: false,
//       },
//     },
//     elements: {
//       point: {
//         radius: 0,
//         hoverRadius: 6,
//       },
//       line: {
//         borderWidth: 2,
//       },
//     },
//   }

//   return (
//     <div className="flex h-screen w-full bg-gray-900 text-white">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
//         <div className="flex items-center mb-8">
//           <div className="bg-white p-2 rounded">
//             <div className="text-black font-bold">◆ ProfitWave</div>
//           </div>
//         </div>

//         <div className="px-2 py-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full bg-gray-800 rounded-md py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//           </div>
//         </div>

//         <div className="mt-6 flex-1">
//           {menuItems.map((item) => (
//             <div key={item.name}>
//               <div
//                 onClick={item.onClick}
//                 className={`flex items-center p-3 mb-2 rounded-md cursor-pointer transition-colors ${
//                   activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
//                 }`}
//               >
//                 <span className="mr-3">{item.icon}</span>
//                 <span>{item.name}</span>
//                 {item.name === "Notifications" && (
//                   <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
//                 )}
//                 {item.hasDropdown && (
//                   <ChevronDown
//                     className={`ml-auto h-4 w-4 transition-transform ${showAutoInvestDropdown ? "rotate-180" : ""}`}
//                   />
//                 )}
//               </div>

//               {item.hasDropdown && showAutoInvestDropdown && (
//                 <div className="ml-8 mb-2 bg-gray-800 rounded-md overflow-hidden">
//                   {sidebarDropdownOptions.map((option, index) => (
//                     <div
//                       key={index}
//                       className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between"
//                       onClick={() => {
//                         setSelectedOption(option.name)
//                         setIsInvesting(true)
//                         setShowAutoInvestDropdown(false)
//                         setActiveMenu("AUTO_INVEST")
//                       }}
//                     >
//                       <span>{option.name}</span>
//                       {option.isPremium && (
//                         <span className="text-xs bg-green-600 text-green-100 px-2 py-0.5 rounded">PREMIUM</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="mt-auto pt-8 flex items-center">
//           <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">S</div>
//           <span className="ml-3 cursor-pointer">Profile</span>
//           <Settings className="ml-auto h-4 w-4 text-gray-400" />
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
//               <div className="px-3 py-1 bg-gray-800 rounded-md">
//                 HIVE: ${typeof cryptoHoldings.HIVE === "number" ? cryptoHoldings.HIVE.toFixed(2) : cryptoHoldings.HIVE}
//               </div>
//               <div className="px-3 py-1 bg-gray-800 rounded-md">
//                 HBD: ${typeof cryptoHoldings.HBD === "number" ? cryptoHoldings.HBD.toFixed(2) : cryptoHoldings.HBD}
//               </div>
//               <div className="px-3 py-1 bg-gray-800 rounded-md">HP: {cryptoHoldings.HP}</div>
//             </div>
//           </div>

//           {/* AUTO_INVEST Status */}
//           {isInvesting && (
//             <div className="bg-gray-800 rounded-lg p-6 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
//                     <Robot className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold">AUTO_INVEST is started</h2>
//                     <p className="text-gray-400">Bot is investing for 5 minutes</p>
//                   </div>
//                 </div>
//                 <button
//                   className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors flex items-center"
//                   onClick={() => setIsInvesting(false)}
//                 >
//                   <X className="w-4 h-4 mr-1" />
//                   Stop
//                 </button>
//               </div>
//               <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
//                 <div
//                   className="bg-purple-500 h-full rounded-full animate-pulse"
//                   style={{
//                     width: selectedOption === "for 5 min." ? "60%" : selectedOption === "for 10 min." ? "40%" : "20%",
//                   }}
//                 ></div>
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-6">
//             {/* Profit Section */}
//             <div className="bg-gray-800 rounded-lg p-6 overflow-hidden">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-medium">Profit</h2>
//                 <div className="flex items-center gap-2">
//                   <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
//                     Daily
//                   </div>
//                   <div className="px-2 py-1 text-xs rounded bg-purple-700 cursor-pointer">Monthly</div>
//                   <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
//                     Yearly
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center mt-4">
//                 <div>
//                   <div className="text-3xl font-bold">${profit.total.toFixed(2)}</div>
//                   <div className="flex items-center mt-1">
//                     <div className="flex items-center text-green-400">
//                       <svg
//                         className="w-4 h-4 mr-1"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M5 10l7-7m0 0l7 7m-7-7v18"
//                         />
//                       </svg>
//                       <span>{profit.growth}%</span>
//                     </div>
//                     <span className="text-gray-400 text-sm ml-2">vs last period</span>
//                   </div>
//                 </div>
//                 <div className="ml-auto px-3 py-1 bg-purple-900/30 rounded-md text-purple-300 text-sm">
//                   +$45.32 today
//                 </div>
//               </div>

//               <div className="mt-6 h-40 flex items-end space-x-2">
//                 {profit.months.map((data, index) => (
//                   <div key={data.month} className="flex flex-col items-center flex-1 group">
//                     <div
//                       className="w-full rounded-sm bg-gradient-to-t from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 transition-colors relative"
//                       style={{ height: `${data.value / 7}%` }}
//                     >
//                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                         ${data.value.toFixed(2)}
//                       </div>
//                     </div>
//                     <div className="text-xs mt-2 text-gray-400">{data.month}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Transactions Section */}
//             <div className="bg-gray-800 rounded-lg p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-medium">Transactions</h2>
//                 <div className="flex space-x-2">
//                   <div className="px-2 py-1 text-xs rounded bg-purple-700 cursor-pointer">All</div>
//                   <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
//                     Buy
//                   </div>
//                   <div className="px-2 py-1 text-xs rounded bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors">
//                     Sell
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-4 space-y-3">
//                 {transactions.map((tx, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
//                   >
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mr-3 text-white font-medium">
//                       {tx.crypto.charAt(0)}
//                     </div>
//                     <div>
//                       <div className="font-medium">{tx.crypto}</div>
//                       <div className="text-xs text-gray-400 flex items-center">
//                         <span
//                           className={`inline-block w-2 h-2 rounded-full ${tx.action === "buy" ? "bg-green-400" : "bg-red-400"} mr-1`}
//                         ></span>
//                         {tx.action.charAt(0).toUpperCase() + tx.action.slice(1)}
//                         <span className="text-gray-500 mx-1">•</span>
//                         <span>{new Date().toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                     <div className="ml-auto text-right">
//                       <div className={`font-medium ${tx.action === "buy" ? "text-green-400" : "text-red-400"}`}>
//                         {tx.amount}
//                       </div>
//                       <div className="text-xs text-gray-400">{tx.percentage}</div>
//                     </div>
//                   </div>
//                 ))}
//                 <button className="w-full mt-4 py-2 rounded-md border border-dashed border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm flex items-center justify-center">
//                   <Plus size={16} className="mr-1" />
//                   View All Transactions
//                 </button>
//               </div>
//             </div>

//             {/* Sales Chart - Improved */}
//             <div className="bg-gray-800 rounded-lg p-6 col-span-2">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-medium">Sales Chart</h2>
//                 <div className="flex space-x-4">
//                   <AutoInvestDropdown />
//                   <div className="flex items-center text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-md">
//                     <span>08.08.2024</span>
//                     <ChevronDown className="ml-2 h-4 w-4" />
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-2 flex space-x-6 text-sm">
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
//                   <span>HIVE</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
//                   <span>HBD</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
//                   <span>HP</span>
//                 </div>
//               </div>

//               <div className="mt-6 h-96">
//                 <Line data={chartData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AiRoboIcon from '../Images/AiRoboIcon.png';
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

//   // Dropdown options for AUTO_INVEST
//   const dropdownOptions = [
//     { name: "Continue AUTO_INVEST.", icon: "⏱️", isPremium: true },
//     { name: "for 5 min.", icon: "⏱️", isPremium: true },
//     { name: "for 10 min.", icon: "⏱️", isPremium: true },
//     { name: "for 15 min.", icon: "⏱️", isPremium: true },
//     { name: "for 20 min.", icon: "⏱️" },
//     { name: "for 25 min.", icon: "⏱️" },
//     { name: "for 30 min.", icon: "⏱️" },
//   ];

//   const AutoInvestDropdown = () => {
//     const [selectedOption, setSelectedOption] = useState("Select Duration ⏳");
//     const [dropdownOpen, setDropdownOpen] = useState(false);
  
//     const dropdownOptions = [
//       { name: "1 Month", icon: "📅" },
//       { name: "3 Months", icon: "📆" },
//       { name: "6 Months", icon: "📊" },
//       { name: "1 Year", icon: "📈" },
//     ];
  
//     const handleDropdownSelect = async (option) => {
//       setSelectedOption(option.name);
//       setDropdownOpen(false);
  
//       try {
//         const response = await axios.post("http://localhost:3500/api/investment/trade", {
//           duration: option.name,
//         });
  
//         console.log("Server Response:", response.data);
//       } catch (error) {
//         console.error("Error sending AUTO_INVEST request:", error);
//       }
//     };
  
//     return (
//       <div className="relative">
//         <button 
//           className="bg-gray-800 px-4 py-2 rounded-md w-full text-left"
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//         >
//           {selectedOption} ⏳
//         </button>
  
//         {dropdownOpen && (
//           <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-md shadow-lg">
//             {dropdownOptions.map((option, index) => (
//               <div 
//                 key={index} 
//                 className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
//                 onClick={() => handleDropdownSelect(option)}
//               >
//                 {option.icon} {option.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Menu items
//   const menuItems = [
//     { name: "Dashboard", icon: "□", onClick: () => setActiveMenu("Dashboard") },
//     { name: "Overview", icon: "◫", onClick: () => setActiveMenu("Overview") },
//     { name: "AUTO_INVEST", icon: "🤖", onClick: () => setActiveMenu("AUTO_INVEST") },
//     { name: "Payment", icon: "💳", onClick: () => setActiveMenu("Payment") },
//     { name: "Information", icon: "ℹ", onClick: () => setActiveMenu("Information") },
//     { name: "Notifications", icon: "🔔", onClick: () => setActiveMenu("Notifications") },
//     { name: "AI_Simulator", icon: "🤖", onClick: () => navigate("/ai-simulator") } // Add this line
//   ];

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
//     { crypto: "HIVE", action: "buy", amount: "+5.00 HIVE", percentage: "+0.89%" },
//     { crypto: "HBD", action: "buy", amount: "+0.90 HBD", percentage: "+0.16%" },
//     { crypto: "HP", action: "buy", amount: "+2.00 HP", percentage: "+3.09%" },
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
//           {menuItems.map((item) => (
//             <div
//               key={item.name}
//               onClick={item.onClick}
//               className={`flex items-center p-3 mb-2 rounded-md cursor-pointer ${
//                 activeMenu === item.name ? "bg-gray-800" : "hover:bg-gray-800"
//               }`}
//             >
//               <span className="mr-3">{item.icon}</span>
//               <span>{item.name}</span>
//               {item.name === "Notifications" && (
//                 <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-md">4</span>
//               )}
//             </div>
//           ))}
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
//                       src={AiRoboIcon || "/placeholder.svg"}
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
//                     <h2 className="text-xl font-bold">The Bot is doing Auto Investment in {selectedOption}</h2>
//                     {/* <p className="text-gray-400">The Bot is doing {selectedOption}</p> */}
//                   </div>
//                 </div>
//                 <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">Stop</button>
//               </div>
//               {/* <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
//                 <div
//                   className="bg-purple-500 h-full rounded-full animate-pulse"
//                   style={{
//                     width: selectedOption === "for 5 min." ? "60%" : selectedOption === "for 10 min." ? "40%" : "20%",
//                   }}
//                 ></div>
//               </div> */}
//               {/* <div className="mt-2 text-right text-sm text-gray-400">
//                 {selectedOption === "for 5 min."
//                   ? "3 minutes remaining"
//                   : selectedOption === "for 10 min."
//                     ? "6 minutes remaining"
//                     : "24 minutes remaining"}
//               </div> */}
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


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AiRoboIcon from '../Images/AiRoboIcon.png';
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

//   // Dropdown options for AUTO_INVEST
//   const dropdownOptions = [
//     { name: "Continue AUTO_INVEST.", icon: "⏱️", isPremium: true },
//     { name: "for 5 min.", icon: "⏱️", isPremium: true },
//     { name: "for 10 min.", icon: "⏱️", isPremium: true },
//     { name: "for 15 min.", icon: "⏱️", isPremium: true },
//     { name: "for 20 min.", icon: "⏱️" },
//     { name: "for 25 min.", icon: "⏱️" },
//     { name: "for 30 min.", icon: "⏱️" },
//   ];

//   const AutoInvestDropdown = () => {
//     const [selectedOption, setSelectedOption] = useState("Select Duration ⏳");
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const [dropdownData, setDropdownData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//       const fetchDropdownData = async () => {
//         setIsLoading(true);
//         try {
//           const response = await fetch('https://backend-hivequant.onrender.com/api/investments/frequencies');  // Adjust the endpoint as per your API
//           if (!response.ok) {
//             throw new Error('Failed to fetch dropdown data');
//           }
//           const data = await response.json();
          
//           // Transform API data to match dropdown format
//           const formattedData = data.map(item => ({
//             name: item.duration,
//             icon: getDurationIcon(item.durationType), // Helper function to assign icons
//             isPremium: item.isPremium,
//             value: item.value // Additional data if needed
//           }));
          
//           setDropdownData(formattedData);
//         } catch (err) {
//           setError(err.message);
//           console.error('Error fetching dropdown data:', err);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchDropdownData();
//     }, []);

//     // Helper function to assign icons based on duration type
//     const getDurationIcon = (durationType) => {
//       const iconMap = {
//         minutes: "⏱️",
//         hours: "⏰",
//         days: "📅",
//         months: "📆",
//         years: "📈"
//       };
//       return iconMap[durationType] || "⏳";
//     };

//     // Render loading state
//     if (isLoading) {
//       return (
//         <div className="flex items-center space-x-2">
//           <span>Loading...</span>
//           <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
//         </div>
//       );
//     }

//     // Render error state
//     if (error) {
//       return (
//         <div className="text-red-500">
//           Error loading options. Please try again.
//         </div>
//       );
//     }

//     return (
//       <div className="relative dropdown-container">
//         <div
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center p-3 rounded-md cursor-pointer bg-gray-800 hover:bg-gray-700"
//         >
//           <span>{selectedOption}</span>
//           <span
//             className="ml-2 transition-transform duration-200"
//             style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
//           >
//             ▼
//           </span>
//         </div>

//         {dropdownOpen && (
//           <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
//             {dropdownData.map((option) => (
//               <div
//                 key={option.name}
//                 onClick={() => {
//                   setSelectedOption(option.name);
//                   setDropdownOpen(false);
//                   // Add your selection handler here
//                   onOptionSelect(option);
//                 }}
//                 className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
//               >
//                 <span className="mr-3">{option.icon}</span>
//                 <span>{option.name}</span>
//                 {selectedOption === option.name && (
//                   <span className="ml-auto text-purple-400">✓</span>
//                 )}
//                 {option.isPremium && (
//                   <span className="ml-2 text-xs text-yellow-400">Premium</span>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Add this function to handle selection
//   const onOptionSelect = (option) => {
//     // Handle the selected option
//     console.log('Selected option:', option);
//     // Add your logic here (e.g., API call, state update, etc.)
//   };

//   // Menu items
//   const menuItems = [
//     { name: "Dashboard", icon: "□", onClick: () => setActiveMenu("Dashboard") },
//     { name: "Overview", icon: "◫", onClick: () => setActiveMenu("Overview") },
//     { name: "AUTO_INVEST", icon: "🤖", onClick: () => setActiveMenu("AUTO_INVEST") },
//     { name: "Payment", icon: "💳", onClick: () => setActiveMenu("Payment") },
//     { name: "Information", icon: "ℹ", onClick: () => setActiveMenu("Information") },
//     { name: "Notifications", icon: "🔔", onClick: () => setActiveMenu("Notifications") },
//     { name: "Simulator", icon: "🤖", onClick: () => navigate('/simulator') },
//   ];

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
//     { crypto: "HIVE", action: "buy", amount: "+5.00 HIVE", percentage: "+0.89%" },
//     { crypto: "HBD", action: "buy", amount: "+0.90 HBD", percentage: "+0.16%" },
//     { crypto: "HP", action: "buy", amount: "+2.00 HP", percentage: "+3.09%" },
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

//         {/* Sidebar menu items */}
//         <div className="mt-6">
//           {menuItems.map((item) => (
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
//                       src={AiRoboIcon || "/placeholder.svg"}
//                       alt="AI"
//                       className="w-5 h-5"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "data:image/svg+xml,..."; // Keep existing fallback
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

//                 {/* Dropdown Menu */}
//                 {dropdownOpen && (
//                   <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
//                     {dropdownOptions.map((option) => (
//                       <div
//                         key={option.name}
//                         onClick={() => {
//                           setSelectedOption(option.name);
//                           setDropdownOpen(false);
//                         }}
//                         className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
//                       >
//                         <span className="mr-3">{option.icon}</span>
//                         <span>{option.name}</span>
//                         {selectedOption === option.name && (
//                           <span className="ml-auto text-purple-400">✓</span>
//                         )}
//                         {option.isPremium && (
//                           <span className="ml-2 text-xs text-yellow-400">Premium</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // Regular menu items remain unchanged
//               <div
//                 key={item.name}
//                 onClick={item.onClick || (() => setActiveMenu(item.name))}
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
//           ))}
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
//                       src={AiRoboIcon || "/placeholder.svg"}
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



