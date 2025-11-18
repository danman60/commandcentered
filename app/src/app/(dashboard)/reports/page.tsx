'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'financial' | 'performance' | 'event-summary' | 'equipment'>('financial');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-11-11');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  // Mock data for demonstration
  const keyMetrics = {
    totalRevenue: 245830,
    totalEvents: 47,
    operatorHours: 612,
    equipmentUtilization: 76,
  };

  const revenueData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 22300 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 25600 },
    { month: 'May', revenue: 21400 },
    { month: 'Jun', revenue: 27200 },
    { month: 'Jul', revenue: 23800 },
    { month: 'Aug', revenue: 26500 },
    { month: 'Sep', revenue: 20900 },
    { month: 'Oct', revenue: 24300 },
    { month: 'Nov', revenue: 15530 },
  ];

  const eventsByType = [
    { type: 'Dance Recital', count: 18, color: 'bg-cyan-500' },
    { type: 'Concert', count: 12, color: 'bg-purple-500' },
    { type: 'Promo Video', count: 10, color: 'bg-green-500' },
    { type: 'Corporate', count: 7, color: 'bg-orange-500' },
  ];

  const operatorHours = [
    { name: 'John Smith', hours: 156 },
    { name: 'Sarah Johnson', hours: 142 },
    { name: 'Mike Davis', hours: 128 },
    { name: 'Lisa Rodriguez', hours: 98 },
    { name: 'Tom Wilson', hours: 88 },
  ];

  const equipmentUtilization = [
    { name: 'Canon R5', utilization: 92 },
    { name: 'Sony FX30', utilization: 85 },
    { name: 'Audio Kit', utilization: 78 },
    { name: 'LED Panel', utilization: 65 },
    { name: 'Drone', utilization: 42 },
  ];

  const detailedReports = [
    {
      date: '2025-11-08',
      client: 'ABC Dance Studio',
      eventType: 'Dance Recital',
      operators: 'John S., Sarah J.',
      duration: 6.5,
      revenue: 5200,
      equipment: 'Canon R5, Audio Kit',
      status: 'Completed',
    },
    {
      date: '2025-11-15',
      client: 'XYZ Corporation',
      eventType: 'Concert',
      operators: 'Mike D., Lisa R.',
      duration: 8,
      revenue: 6800,
      equipment: 'Sony FX30, LED Panel',
      status: 'In Progress',
    },
    {
      date: '2025-11-22',
      client: 'Metro Promos',
      eventType: 'Promo Video',
      operators: 'Tom W.',
      duration: 4,
      revenue: 2500,
      equipment: 'Drone',
      status: 'Scheduled',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'In Progress':
        return 'bg-blue-500 text-white';
      case 'Scheduled':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const maxRevenueValue = Math.max(...revenueData.map((d) => d.revenue));
  const maxOperatorHours = Math.max(...operatorHours.map((d) => d.hours));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📈</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              Reports
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Filters Panel */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-cyan-500 mb-4">⚙️ Report Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">Report Type</label>
              <select
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
              >
                <option value="financial">Financial Report</option>
                <option value="performance">Operator Performance</option>
                <option value="event-summary">Event Summary</option>
                <option value="equipment">Equipment Utilization</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">Client</label>
              <select className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-cyan-500">
                <option value="">All Clients</option>
                <option value="abc">ABC Dance Studio</option>
                <option value="xyz">XYZ Corporation</option>
                <option value="metro">Metro Promos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">Event Type</label>
              <select className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-cyan-500">
                <option value="">All Event Types</option>
                <option value="recital">Dance Recital</option>
                <option value="concert">Concert</option>
                <option value="promo">Promo Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">Operator</label>
              <select className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-cyan-500">
                <option value="">All Operators</option>
                <option value="john">John Smith</option>
                <option value="sarah">Sarah Johnson</option>
                <option value="mike">Mike Davis</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-cyan-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              APPLY FILTERS
            </button>
            <button className="px-5 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              RESET
            </button>
          </div>
        </div>

        {/* Year-over-Year Comparison Toggle */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="text-sm font-semibold text-cyan-500 uppercase">Year-over-Year Comparison</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">OFF</span>
            <button
              onClick={() => setComparisonEnabled(!comparisonEnabled)}
              className={`w-12 h-6 rounded-full transition-all ${
                comparisonEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              } relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                  comparisonEnabled ? 'left-6' : 'left-0.5'
                }`}
              ></div>
            </button>
            <span className="text-xs text-slate-400">ON</span>
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 mb-6 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-cyan-500 uppercase">Export Report:</span>
          <button className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded text-sm font-semibold hover:bg-slate-700/50 transition-all">
            📄 PDF
          </button>
          <button className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded text-sm font-semibold hover:bg-slate-700/50 transition-all">
            📊 CSV
          </button>
          <button className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded text-sm font-semibold hover:bg-slate-700/50 transition-all">
            📈 EXCEL
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 text-center">
            <div className="text-sm text-slate-400 uppercase mb-2">Total Revenue</div>
            <div className="text-4xl font-bold text-green-500 mb-2">${keyMetrics.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-slate-500">+12.5% vs Last Period</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 text-center">
            <div className="text-sm text-slate-400 uppercase mb-2">Total Events</div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">{keyMetrics.totalEvents}</div>
            <div className="text-xs text-slate-500">+8 vs Last Period</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 text-center">
            <div className="text-sm text-slate-400 uppercase mb-2">Operator Hours</div>
            <div className="text-4xl font-bold text-blue-500 mb-2">{keyMetrics.operatorHours}</div>
            <div className="text-xs text-slate-500">+42 vs Last Period</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 text-center">
            <div className="text-sm text-slate-400 uppercase mb-2">Equipment Utilization</div>
            <div className="text-4xl font-bold text-orange-500 mb-2">{keyMetrics.equipmentUtilization}%</div>
            <div className="text-xs text-slate-500">-4% vs Last Period</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Over Time Chart */}
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-cyan-500 mb-4">Revenue Over Time</h3>
            <div className="bg-slate-900/60 p-4 rounded-lg" style={{ height: '300px' }}>
              {/* Simple bar chart visualization */}
              <div className="h-full flex items-end justify-around gap-1">
                {revenueData.map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-600 rounded-t"
                      style={{ height: `${(item.revenue / maxRevenueValue) * 100}%` }}
                    ></div>
                    <span className="text-xs text-slate-400">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Events by Type Chart */}
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-cyan-500 mb-4">Events by Type</h3>
            <div className="bg-slate-900/60 p-4 rounded-lg" style={{ height: '300px' }}>
              <div className="h-full flex flex-col justify-center gap-3">
                {eventsByType.map((item) => (
                  <div key={item.type} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-slate-300">{item.type}</div>
                    <div className="flex-1 bg-slate-700/30 rounded-full h-8 relative overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full flex items-center justify-end px-3`}
                        style={{ width: `${(item.count / 18) * 100}%` }}
                      >
                        <span className="text-white font-bold text-sm">{item.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operator Hours Chart */}
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-cyan-500 mb-4">Operator Hours Distribution</h3>
            <div className="bg-slate-900/60 p-4 rounded-lg" style={{ height: '300px' }}>
              <div className="h-full flex items-end justify-around gap-2">
                {operatorHours.map((item) => (
                  <div key={item.name} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t flex items-center justify-center"
                      style={{ height: `${(item.hours / maxOperatorHours) * 100}%` }}
                    >
                      <span className="text-white font-bold text-xs">{item.hours}h</span>
                    </div>
                    <span className="text-xs text-slate-400 text-center">{item.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment Utilization Chart */}
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-cyan-500 mb-4">Equipment Utilization</h3>
            <div className="bg-slate-900/60 p-4 rounded-lg" style={{ height: '300px' }}>
              <div className="h-full flex flex-col justify-center gap-3">
                {equipmentUtilization.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div className="w-28 text-sm text-slate-300">{item.name}</div>
                    <div className="flex-1 bg-slate-700/30 rounded-full h-7 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full flex items-center justify-end px-3"
                        style={{ width: `${item.utilization}%` }}
                      >
                        <span className="text-white font-bold text-xs">{item.utilization}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-cyan-500 mb-4">Detailed Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Date
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Client
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Event Type
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Operators
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Duration (hrs)
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Revenue
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Equipment Used
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailedReports.map((report, idx) => (
                  <tr key={idx} className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-100">{report.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{report.client}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{report.eventType}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{report.operators}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{report.duration}</td>
                    <td className="px-5 py-4 text-sm text-green-500 font-semibold">${report.revenue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{report.equipment}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
