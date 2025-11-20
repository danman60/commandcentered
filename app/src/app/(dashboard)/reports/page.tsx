'use client';

import { trpc } from '@/lib/trpc/client';
import { useState, useMemo } from 'react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'financial' | 'performance' | 'event-summary' | 'equipment'>('financial');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-11-30');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  // Fetch real data from backend
  const { data: revenueReport, isLoading: revenueLoading } = trpc.report.getRevenueReport.useQuery({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    groupBy: 'month',
  });

  const { data: eventSummary, isLoading: eventsLoading } = trpc.report.getEventSummary.useQuery({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    groupBy: 'eventType',
  });

  const { data: operatorPerformance, isLoading: operatorsLoading } = trpc.report.getOperatorPerformance.useQuery({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  const { data: gearUtilization, isLoading: gearLoading } = trpc.report.getGearUtilization.useQuery({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  const { data: eventList, isLoading: eventListLoading } = trpc.event.list.useQuery({});

  // Calculate key metrics from real data
  const keyMetrics = useMemo(() => {
    const totalRevenue = revenueReport?.reduce((sum, row) => sum + row.actualRevenue, 0) || 0;
    const totalEvents = revenueReport?.reduce((sum, row) => sum + row.eventCount, 0) || 0;
    const operatorHours = operatorPerformance?.reduce((sum, op) => sum + op.totalHours, 0) || 0;
    const avgUtilization = (gearUtilization?.reduce((sum, gear) => sum + gear.utilizationPercent, 0) ?? 0) / (gearUtilization?.length || 1);

    return {
      totalRevenue: Math.round(totalRevenue),
      totalEvents,
      operatorHours: Math.round(operatorHours),
      equipmentUtilization: Math.round(avgUtilization),
    };
  }, [revenueReport, operatorPerformance, gearUtilization]);

  // Transform revenue data for chart
  const revenueData = useMemo(() => {
    if (!revenueReport) return [];

    return revenueReport.map(row => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(row.period.split('-')[1] || '0') - 1;

      return {
        month: monthNames[monthIndex] || row.period,
        revenue: row.actualRevenue || row.projectedRevenue,
      };
    });
  }, [revenueReport]);

  // Transform event summary for chart
  const eventsByType = useMemo(() => {
    if (!eventSummary) return [];

    const colors = ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-blue-500'];

    return eventSummary.map((event, index) => ({
      type: event.eventType,
      count: event.count,
      color: colors[index % colors.length] || 'bg-green-500',
    }));
  }, [eventSummary]);

  // Transform operator performance for chart (top 5)
  const operatorHours = useMemo(() => {
    if (!operatorPerformance) return [];

    return operatorPerformance.slice(0, 5).map(op => ({
      name: op.operatorName,
      hours: op.totalHours,
    }));
  }, [operatorPerformance]);

  // Transform gear utilization for chart (top 5)
  const equipmentUtilization = useMemo(() => {
    if (!gearUtilization) return [];

    return gearUtilization.slice(0, 5).map(gear => ({
      name: gear.gearName,
      utilization: Math.round(gear.utilizationPercent),
    }));
  }, [gearUtilization]);

  // Transform event list for detailed reports (last 10 events)
  const detailedReports = useMemo(() => {
    if (!eventList) return [];

    return eventList.slice(0, 10).map(event => ({
      date: new Date(event.loadInTime).toLocaleDateString(),
      client: event.clientName || 'Unknown',
      eventType: event.eventType,
      operators: 'N/A', // Requires shift assignments relation
      duration: event.loadOutTime && event.loadInTime
        ? Math.round((new Date(event.loadOutTime).getTime() - new Date(event.loadInTime).getTime()) / (1000 * 60 * 60) * 10) / 10
        : 0,
      revenue: Number(event.actualRevenue || event.revenueAmount || 0),
      equipment: 'N/A', // Requires gear assignments relation
      status: event.status,
    }));
  }, [eventList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500 text-white';
      case 'IN_PROGRESS':
        return 'bg-blue-500 text-white';
      case 'CONFIRMED':
        return 'bg-green-500 text-white';
      case 'TENTATIVE':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const maxRevenueValue = Math.max(...revenueData.map((d) => d.revenue), 1);
  const maxOperatorHours = Math.max(...operatorHours.map((d) => d.hours), 1);
  const maxEventCount = Math.max(...eventsByType.map((d) => d.count), 1);

  const isLoading = revenueLoading || eventsLoading || operatorsLoading || gearLoading || eventListLoading;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📈</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Reports
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Filters Panel */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-green-500 mb-4">⚙️ Report Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-green-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded text-slate-100 focus:outline-none focus:border-green-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-12 mb-6 text-center">
            <div className="text-green-500 text-lg font-semibold mb-2">Loading Report Data...</div>
            <div className="text-slate-400 text-sm">Fetching metrics from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Year-over-Year Comparison Toggle */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="text-sm font-semibold text-green-500 uppercase">Year-over-Year Comparison</div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">OFF</span>
                <button
                  onClick={() => setComparisonEnabled(!comparisonEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    comparisonEnabled ? 'bg-green-500' : 'bg-slate-700'
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
              <span className="text-sm font-semibold text-green-500 uppercase">Export Report:</span>
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
                <div className="text-xs text-slate-500">{revenueReport?.length || 0} periods</div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 text-center">
                <div className="text-sm text-slate-400 uppercase mb-2">Total Events</div>
                <div className="text-4xl font-bold text-green-500 mb-2">{keyMetrics.totalEvents}</div>
                <div className="text-xs text-slate-500">{eventsByType.length} types</div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 text-center">
                <div className="text-sm text-slate-400 uppercase mb-2">Operator Hours</div>
                <div className="text-4xl font-bold text-blue-500 mb-2">{keyMetrics.operatorHours}</div>
                <div className="text-xs text-slate-500">{operatorPerformance?.length || 0} operators</div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 text-center">
                <div className="text-sm text-slate-400 uppercase mb-2">Equipment Utilization</div>
                <div className="text-4xl font-bold text-orange-500 mb-2">{keyMetrics.equipmentUtilization}%</div>
                <div className="text-xs text-slate-500">{gearUtilization?.length || 0} items tracked</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Over Time Chart */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-500 mb-4">Revenue Over Time</h3>
                {revenueData.length === 0 ? (
                  <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                    No revenue data for selected period
                  </div>
                ) : (
                  <div className="bg-slate-900/60 p-4 rounded-lg" style={{ height: '300px' }}>
                    <div className="h-full flex items-end justify-around gap-1">
                      {revenueData.map((item) => (
                        <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t"
                            style={{ height: `${(item.revenue / maxRevenueValue) * 100}%` }}
                          ></div>
                          <span className="text-xs text-slate-400">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Events by Type Chart */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-500 mb-4">Events by Type</h3>
                {eventsByType.length === 0 ? (
                  <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                    No events for selected period
                  </div>
                ) : (
                  <div className="bg-slate-900/60 p-4 rounded-lg" style={{ height: '300px' }}>
                    <div className="h-full flex flex-col justify-center gap-3">
                      {eventsByType.map((item) => (
                        <div key={item.type} className="flex items-center gap-4">
                          <div className="w-32 text-sm text-slate-300">{item.type}</div>
                          <div className="flex-1 bg-slate-700/30 rounded-full h-8 relative overflow-hidden">
                            <div
                              className={`${item.color} h-full rounded-full flex items-center justify-end px-3`}
                              style={{ width: `${(item.count / maxEventCount) * 100}%` }}
                            >
                              <span className="text-white font-bold text-sm">{item.count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Operator Hours Chart */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-500 mb-4">Operator Hours Distribution (Top 5)</h3>
                {operatorHours.length === 0 ? (
                  <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                    No operator hours for selected period
                  </div>
                ) : (
                  <div className="bg-slate-900/60 p-4 rounded-lg" style={{ height: '300px' }}>
                    <div className="h-full flex items-end justify-around gap-2">
                      {operatorHours.map((item) => (
                        <div key={item.name} className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t flex items-center justify-center"
                            style={{ height: `${(item.hours / maxOperatorHours) * 100}%` }}
                          >
                            <span className="text-white font-bold text-xs">{Math.round(item.hours)}h</span>
                          </div>
                          <span className="text-xs text-slate-400 text-center">{item.name.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Equipment Utilization Chart */}
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-500 mb-4">Equipment Utilization (Top 5)</h3>
                {equipmentUtilization.length === 0 ? (
                  <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                    No equipment utilization data
                  </div>
                ) : (
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
                )}
              </div>
            </div>

            {/* Detailed Reports Table */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-500 mb-4">Recent Events (Last 10)</h3>
              {detailedReports.length === 0 ? (
                <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                  No detailed event data available
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/80">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Date
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Client
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Event Type
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Duration (hrs)
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Revenue
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedReports.map((report, idx) => (
                        <tr key={idx} className="border-b border-slate-700/20 hover:bg-green-500/5 transition-colors">
                          <td className="px-5 py-4 text-sm text-slate-100">{report.date}</td>
                          <td className="px-5 py-4 text-sm text-slate-300">{report.client}</td>
                          <td className="px-5 py-4 text-sm text-slate-300">{report.eventType}</td>
                          <td className="px-5 py-4 text-sm text-slate-300">{report.duration}</td>
                          <td className="px-5 py-4 text-sm text-green-500 font-semibold">${report.revenue.toLocaleString()}</td>
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
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
