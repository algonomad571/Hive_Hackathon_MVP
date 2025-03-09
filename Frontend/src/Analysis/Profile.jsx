// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // Profile Page Components
// const Profile = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         console.log('Starting to fetch profile data...');
//         const response = await axios.get('http://localhost:5000/api/profile/john.smith');
//         console.log('API Response:', response.data);

//         if (response.data.success && response.data.data) {
//           console.log('Setting profile data:', response.data.data);
//           setProfileData(response.data.data);
//           setError(null);
//         } else {
//           setError('No profile data found');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         setError(error.response?.data?.error || error.message || 'Failed to load profile data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-red-500 text-xl">{error}</div>
//       </div>
//     );
//   }

//   if (!profileData) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-xl">No profile data available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       {/* Header Section */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">{profileData.username}</h1>
//         <p className="text-gray-400">Member since: {new Date(profileData.memberSince).toLocaleDateString()}</p>
//       </div>

//       {/* Portfolio Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-gray-800 rounded-lg p-6">
//           <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-400">Total Value</p>
//               <p className="text-2xl font-bold">${profileData.portfolio.totalValue.toLocaleString()}</p>
//             </div>
//             <div>
//               <p className="text-gray-400">Returns</p>
//               <p className="text-2xl font-bold text-green-500">
//                 ${profileData.portfolio.returns.toLocaleString()} ({profileData.portfolio.returnsPercentage}%)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Distribution */}
//         <div className="bg-gray-800 rounded-lg p-6">
//           <h2 className="text-xl font-bold mb-4">Portfolio Distribution</h2>
//           <div className="space-y-2">
//             {profileData.portfolio.distribution.map((item, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <div 
//                     className="w-3 h-3 rounded-full mr-2" 
//                     style={{ backgroundColor: item.color }}
//                   ></div>
//                   <span>{item.name}</span>
//                 </div>
//                 <span>{item.percentage}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Transactions */}
//       <div className="bg-gray-800 rounded-lg p-6 mb-8">
//         <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
//         <div className="space-y-4">
//           {profileData.transactions.map((transaction, index) => (
//             <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-2">
//               <div className="flex items-center">
//                 <div 
//                   className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
//                   style={{ backgroundColor: transaction.iconBg }}
//                 >
//                   {transaction.icon}
//                 </div>
//                 <div>
//                   <p className="font-semibold">{transaction.type}</p>
//                   <p className="text-sm text-gray-400">
//                     {new Date(transaction.date).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//               <p style={{ color: transaction.textColor }}>{transaction.amount}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* AI Insights */}
//       <div className="bg-gray-800 rounded-lg p-6">
//         <h2 className="text-xl font-bold mb-4">AI Insights</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {profileData.aiInsights.map((insight, index) => (
//             <div key={index} className="bg-gray-700 rounded-lg p-4">
//               <div className="flex items-center mb-2">
//                 <span className="text-2xl mr-2">{insight.icon}</span>
//                 <h3 className="font-bold">{insight.title}</h3>
//               </div>
//               <p className="text-gray-300">{insight.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;




import React from 'react';

// Profile Page Components
const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <MainContent />
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="w-full p-6">
      <Header />
      <ProfileContent />
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700 font-bold">
          JS
        </div>
        <div>
          <div className="font-bold">John Smith</div>
          <div className="text-sm text-gray-400">Premium Plan</div>
        </div>
      </div>
    </div>
  );
};

// Profile Content Components
const ProfileContent = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <UserInfoCard />
      <InvestmentSummaryCard />
      <PortfolioPerformanceCard />
      <InvestmentDistributionCard />
      <TransactionHistoryCard />
      <AIInsightsCard />
      <SecuritySettingsCard />
      <SocialCommunityCard />
    </div>
  );
};

// Card Component
const Card = ({ children, className }) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow p-5 ${className}`}>
      {children}
    </div>
  );
};

// Card Title Component
const CardTitle = ({ icon, title }) => {
  return (
    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
      <span className="text-blue-600">{icon}</span> {title}
    </h2>
  );
};

// User Information Section
const UserInfoCard = () => {
  const goals = ['Long-term Growth', 'Moderate Risk', 'Retirement', 'Passive Income'];
  
  return (
    <Card className="col-span-8">
      <CardTitle icon="👤" title="User Information" />
      <div className="flex gap-5">
        <div className="flex items-center justify-center w-24 h-24 bg-gray-300 rounded-lg text-white text-3xl font-bold">
          JS
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">John Smith</h3>
          <div className="flex items-center mb-2">
            <span className="text-blue-600 w-6 mr-2">📧</span>
            john.smith@example.com
          </div>
          <div className="flex items-center mb-2">
            <span className="text-blue-600 w-6 mr-2">📱</span>
            +1 (555) 123-4567
          </div>
          <div className="flex items-center mb-2">
            <span className="text-blue-600 w-6 mr-2">📅</span>
            Member since: Jan 15, 2024
          </div>
          <div className="flex items-center mb-2">
            <span className="text-blue-600 w-6 mr-2">🎯</span>
            Investment Goals:
          </div>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal) => (
              <span 
                key={goal} 
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Investment Summary Card
const InvestmentSummaryCard = () => {
  return (
    <Card className="col-span-4">
      <CardTitle icon="💰" title="Investment Summary" />
      <div className="text-center">
        <div className="text-sm text-gray-400">Total Portfolio Value</div>
        <div className="text-2xl font-bold my-2">$145,728.65</div>
        <div className="inline-block px-2 py-1 rounded-full text-sm bg-green-100 text-green-600">
          +12.5% YTD
        </div>
      </div>
      <hr className="my-4 border-gray-100" />
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-sm text-gray-400">Invested</div>
          <div className="text-xl font-bold my-1">$125K</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Returns</div>
          <div className="text-xl font-bold my-1">$20.7K</div>
          <div className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
            +16.6%
          </div>
        </div>
      </div>
    </Card>
  );
};

// Portfolio Performance Chart
const PortfolioPerformanceCard = () => {
  return (
    <Card className="col-span-8">
      <CardTitle icon="📈" title="Portfolio Performance" />
      <div className="h-64 bg-gray-700 rounded flex items-center justify-center text-gray-500">
        Portfolio Performance Chart
      </div>
    </Card>
  );
};

// Investment Distribution
const InvestmentDistributionCard = () => {
  const distributionData = [
    { name: 'Stocks', percentage: 45, color: '#3a86ff' },
    { name: 'ETFs', percentage: 25, color: '#8338ec' },
    { name: 'Crypto', percentage: 15, color: '#ffbe0b' },
    { name: 'Bonds', percentage: 10, color: '#06d6a0' },
    { name: 'REITs', percentage: 5, color: '#ef476f' },
  ];
  
  return (
    <Card className="col-span-4">
      <CardTitle icon="💼" title="Investment Distribution" />
      {distributionData.map((item) => (
        <div key={item.name} className="mb-3">
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.name}</span>
            </div>
            <span>{item.percentage}%</span>
          </div>
          <div className="h-2 bg-gray-600 rounded-sm">
            <div 
              className="h-full rounded-sm" 
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            ></div>
          </div>
        </div>
      ))}
    </Card>
  );
};

// Transaction History
const TransactionHistoryCard = () => {
  const transactions = [
    { 
      type: 'Deposit', 
      date: 'Mar 04, 2025', 
      amount: '+$2,500.00', 
      icon: '⬆', 
      iconBg: '#06d6a0',
      textColor: '#06d6a0' 
    },
    { 
      type: 'Buy - AAPL', 
      date: 'Mar 02, 2025', 
      amount: '-$1,745.30', 
      icon: '💰', 
      iconBg: '#3a86ff',
      textColor: 'inherit' 
    },
    { 
      type: 'Sell - BTC', 
      date: 'Feb 28, 2025', 
      amount: '+$3,120.45', 
      icon: '💰', 
      iconBg: '#ef476f',
      textColor: '#06d6a0' 
    },
    { 
      type: 'Buy - ETH', 
      date: 'Feb 25, 2025', 
      amount: '-$950.00', 
      icon: '💰', 
      iconBg: '#3a86ff',
      textColor: 'inherit' 
    },
  ];
  
  return (
    <Card className="col-span-6">
      <CardTitle icon="📜" title="Transaction History" />
      <div>
        {transactions.map((transaction, index) => (
          <div key={index} className="flex justify-between py-3 border-b border-gray-100">
            <div className="flex gap-3">
              <div 
                className="w-10 h-10 rounded flex items-center justify-center text-white"
                style={{ backgroundColor: transaction.iconBg }}
              >
                <span>{transaction.icon}</span>
              </div>
              <div>
                <h4 className="font-medium">{transaction.type}</h4>
                <div className="text-sm text-gray-500">{transaction.date}</div>
              </div>
            </div>
            <div className="font-medium" style={{ color: transaction.textColor }}>
              {transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// AI Insights
const AIInsightsCard = () => {
  const insights = [
    {
      title: 'Portfolio Rebalancing',
      description: 'Consider increasing your bond allocation by 5% to reduce volatility in current market conditions.',
      icon: '📈'
    },
    {
      title: 'Timing Suggestion',
      description: 'Tech sector showing potential for entry points this week due to temporary market pullback.',
      icon: '⏳'
    },
    {
      title: 'Risk Alert',
      description: 'Your crypto exposure increased to 15%. Consider diversifying to stay within your risk tolerance levels.',
      icon: '⚠'
    }
  ];
  
  return (
    <Card className="col-span-6">
      <CardTitle icon="⚡" title="AI-Powered Insights" />
      <div>
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-4 py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xl">
              <span>{insight.icon}</span>
            </div>
            <div>
              <h4 className="font-medium mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-500">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Security Settings
const SecuritySettingsCard = () => {
  const [twoFactor, setTwoFactor] = React.useState(true);
  const [priceAlerts, setPriceAlerts] = React.useState(true);
  const [apiAccess, setApiAccess] = React.useState(false);
  
  const securityItems = [
    {
      title: 'Two-Factor Authentication',
      description: 'Enhanced account security',
      icon: '🔒',
      toggled: twoFactor,
      setToggled: setTwoFactor,
      isToggle: true
    },
    {
      title: 'KYC Verification',
      description: 'Identity verified',
      icon: '📜',
      status: 'Completed',
      isToggle: false
    },
    {
      title: 'Price Alerts',
      description: 'Get notified of price changes',
      icon: '🔔',
      toggled: priceAlerts,
      setToggled: setPriceAlerts,
      isToggle: true
    },
    {
      title: 'API Access',
      description: 'Allow 3rd-party connections',
      icon: '🔑',
      toggled: apiAccess,
      setToggled: setApiAccess,
      isToggle: true
    }
  ];
  
  const ToggleSwitch = ({ toggled, onChange }) => {
    return (
      <div 
        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggled ? 'bg-green-500' : 'bg-gray-300'}`}
        onClick={onChange}
      >
        <div 
          className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${toggled ? 'right-0.5' : 'left-0.5'}`}
        ></div>
      </div>
    );
  };
  
  return (
    <Card className="col-span-6">
      <CardTitle icon="🔐" title="Security & Settings" />
      <div>
        {securityItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                <span>{item.icon}</span>
              </div>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </div>
            {item.isToggle ? (
              <ToggleSwitch 
                toggled={item.toggled} 
                onChange={() => item.setToggled(!item.toggled)} 
              />
            ) : (
              <div className="text-green-500 font-bold">✓ {item.status}</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Social & Community
const SocialCommunityCard = () => {
  const investors = [
    {
      initials: 'WB',
      name: 'Warren B.',
      returns: '+24.5%',
      followers: '15.4K'
    },
    {
      initials: 'CW',
      name: 'Cathie W.',
      returns: '+18.7%',
      followers: '12.8K'
    },
    {
      initials: 'RM',
      name: 'Ray M.',
      returns: '+15.2%',
      followers: '10.3K'
    }
  ];
  
  return (
    <Card className="col-span-6">
      <CardTitle icon="🌍" title="Social & Community" />
      <div>
        {investors.map((investor, index) => (
          <div key={index} className="flex items-center py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mr-4">
              {investor.initials}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{investor.name}</h4>
              <div className="text-sm text-gray-500 flex gap-4">
                <span>Return: {investor.returns}</span>
                <span>Followers: {investor.followers}</span>
              </div>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              Follow
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Profile;
