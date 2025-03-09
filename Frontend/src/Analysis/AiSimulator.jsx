
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AiSimulator = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">AI Simulator</h1>
            <button
              onClick={() => navigate(-1)} // Go back to the previous page
              className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Simulation Card 1 */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                  <span className="text-xl">🤖</span>
                </div>
                <h2 className="text-xl font-semibold">Market Analysis</h2>
              </div>
              <p className="text-gray-400">
                Analyze market trends and predict future movements using AI.
              </p>
              <button className="mt-4 px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
                Start Simulation
              </button>
            </div>

            {/* Simulation Card 2 */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                  <span className="text-xl">📈</span>
                </div>
                <h2 className="text-xl font-semibold">Portfolio Optimization</h2>
              </div>
              <p className="text-gray-400">
                Optimize your crypto portfolio for maximum returns with AI.
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                Start Simulation
              </button>
            </div>

            {/* Simulation Card 3 */}
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-4">
                  <span className="text-xl">💹</span>
                </div>
                <h2 className="text-xl font-semibold">Risk Assessment</h2>
              </div>
              <p className="text-gray-400">
                Assess and mitigate risks in your investments using AI.
              </p>
              <button className="mt-4 px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors">
                Start Simulation
              </button>
            </div>
          </div>

          {/* Recent Simulations Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Simulations</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="py-2">Simulation</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-4">Market Analysis</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-600 rounded-md text-sm">
                          Completed
                        </span>
                      </td>
                      <td className="py-4">2023-10-01</td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                          View Report
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-4">Portfolio Optimization</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-yellow-600 rounded-md text-sm">
                          In Progress
                        </span>
                      </td>
                      <td className="py-4">2023-10-05</td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                          View Progress
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4">Risk Assessment</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-red-600 rounded-md text-sm">
                          Failed
                        </span>
                      </td>
                      <td className="py-4">2023-10-10</td>
                      <td className="py-4">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                          Retry
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSimulator;
