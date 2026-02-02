import React from 'react';
import Navbar from '../components/Navbar';
import { Activity, ShieldAlert, CheckCircle, BarChart3, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  // Mock Data
  const stats = [
    { label: 'Total Scans', value: '1,248', icon: <Activity className="text-blue-400" />, change: '+12% this week' },
    { label: 'Threats Blocked', value: '42', icon: <ShieldAlert className="text-red-500" />, change: '+5 today' },
    { label: 'Safe URLs', value: '1,206', icon: <CheckCircle className="text-neon-green" />, change: '96.6% Safety Rate' },
  ];

  const recentScans = [
    { url: 'paypal-secure-login.com', status: 'Phishing', type: 'Credential Theft', time: '2 mins ago' },
    { url: 'google.com', status: 'Safe', type: 'None', time: '5 mins ago' },
    { url: 'amazon-support-x92.net', status: 'Phishing', type: 'Trojan', time: '12 mins ago' },
    { url: 'free-crypto-giveaway.io', status: 'Suspicious', type: 'Heuristic Match', time: '45 mins ago' },
    { url: 'github.com', status: 'Safe', type: 'None', time: '1 hour ago' },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-10">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <BarChart3 className="text-neon-green" /> User Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg hover:border-gray-600 transition">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-black/40 rounded-lg">{stat.icon}</div>
                <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">{stat.change}</span>
              </div>
              <h3 className="text-gray-400 text-sm">{stat.label}</h3>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock size={20} className="text-neon-green" /> Recent Scan History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="border-b border-gray-800 text-gray-500 uppercase font-mono text-xs">
                  <tr>
                    <th className="py-3 px-4">Target URL</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Threat Type</th>
                    <th className="py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentScans.map((scan, index) => (
                    <tr key={index} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-mono text-white truncate max-w-[200px]">{scan.url}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          scan.status === 'Phishing' ? 'bg-red-900/50 text-red-500' :
                          scan.status === 'Suspicious' ? 'bg-orange-900/50 text-orange-500' :
                          'bg-green-900/50 text-neon-green'
                        }`}>
                          {scan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{scan.type}</td>
                      <td className="py-3 px-4 text-gray-600">{scan.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Status */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Account Safety Score</h2>
              <div className="relative pt-4 flex justify-center">
                <div className="w-40 h-40 rounded-full border-8 border-gray-800 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-8 border-neon-green border-t-transparent border-l-transparent rotate-45"></div>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">94</span>
                    <span className="text-gray-500 text-sm block">/ 100</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-neon-green text-sm mt-4 flex items-center justify-center gap-1">
                <CheckCircle size={14} /> Optimization Active
              </p>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-white font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded text-sm transition">
                  Verify Domain
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded text-sm transition">
                  Invite User
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded text-sm transition">
                  Export Data
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded text-sm transition">
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
