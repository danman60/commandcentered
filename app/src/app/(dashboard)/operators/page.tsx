'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function OperatorsPage() {
  const [activeView, setActiveView] = useState<'card' | 'table' | 'calendar'>('calendar');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch operators
  const { data: operators } = trpc.operator.list.useQuery({
    search: searchQuery || undefined,
  });

  // Mock data for demonstration
  const operatorData = [
    {
      id: '1',
      initials: 'JD',
      name: 'John Davis',
      role: 'Lead Videographer',
      eventsThisYear: 24,
      avgRating: 4.9,
      skills: ['Multi-Camera', 'Livestream', 'Audio'],
      availabilityStatus: 'Available Dec 6-10',
      available: true,
    },
    {
      id: '2',
      initials: 'ST',
      name: 'Sarah Thompson',
      role: 'Videographer / Editor',
      eventsThisYear: 18,
      avgRating: 5.0,
      skills: ['Editing', 'Color Grading', 'Gimbal'],
      availabilityStatus: 'Available Dec 6-10',
      available: true,
    },
    {
      id: '3',
      initials: 'MK',
      name: 'Mike K.',
      role: 'Videographer',
      eventsThisYear: 16,
      avgRating: 4.8,
      skills: ['Drone', 'Gimbal', 'Photo'],
      availabilityStatus: 'Unavailable Dec 6-8',
      available: false,
    },
    {
      id: '4',
      initials: 'LR',
      name: 'Lisa Rodriguez',
      role: 'Audio / Video',
      eventsThisYear: 12,
      avgRating: 4.9,
      skills: ['Audio Engineering', 'Lighting', 'Livestream'],
      availabilityStatus: 'Available Dec 6-10',
      available: true,
    },
  ];

  // Generate calendar days (December 2025)
  const generateCalendarDays = () => {
    const days = [];
    // Previous month days
    days.push({ day: 30, otherMonth: true, operators: [] });

    // Current month days (1-31)
    for (let i = 1; i <= 31; i++) {
      const operators: string[] = [];
      // Simulate random operator availability
      if (i % 2 === 1) operators.push('JD');
      if (i % 3 === 1 || i % 3 === 2) operators.push('ST');
      if (i > 1 && i < 28 && i % 2 === 0) operators.push('MK');
      if (i === 6 || i === 8 || i === 13 || i === 27) operators.push('LR');

      days.push({ day: i, otherMonth: false, operators });
    }

    // Next month days
    days.push({ day: 1, otherMonth: true, operators: [] });
    days.push({ day: 2, otherMonth: true, operators: [] });
    days.push({ day: 3, otherMonth: true, operators: [] });

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">👷</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              Operators
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              📊 Export
            </button>
            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              ➕ Add Operator
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('card')}
            title="Card View"
            className={`px-5 py-3 rounded-lg font-medium transition-all ${
              activeView === 'card'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-800/80'
            }`}
          >
            📇 Card View
          </button>
          <button
            onClick={() => setActiveView('table')}
            title="Table View"
            className={`px-5 py-3 rounded-lg font-medium transition-all ${
              activeView === 'table'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-800/80'
            }`}
          >
            📋 Table View
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            title="Calendar View"
            className={`px-5 py-3 rounded-lg font-medium transition-all ${
              activeView === 'calendar'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-800/80'
            }`}
          >
            📅 Calendar View
          </button>
        </div>

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-100">December 2025 - Operator Availability</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 hover:bg-slate-700/50 transition-all">
                  ◀ Prev
                </button>
                <button className="px-4 py-2 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 hover:bg-slate-700/50 transition-all">
                  Today
                </button>
                <button className="px-4 py-2 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 hover:bg-slate-700/50 transition-all">
                  Next ▶
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 bg-slate-700/20 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-slate-900/80 p-3 text-center text-xs font-semibold text-cyan-500 uppercase">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((dayData, idx) => (
                <div
                  key={idx}
                  className={`bg-slate-800/50 p-3 min-h-[100px] flex flex-col gap-1 ${
                    dayData.otherMonth ? 'opacity-30' : ''
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-400 mb-2">{dayData.day}</div>
                  <div className="flex flex-wrap gap-1">
                    {dayData.operators.map((operator, opIdx) => (
                      <span
                        key={opIdx}
                        className="inline-block px-2 py-1 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded text-xs font-semibold text-white"
                      >
                        {operator}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card View */}
        {activeView === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {operatorData.map((operator) => (
              <div
                key={operator.id}
                className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 hover:border-cyan-500/50 hover:-translate-y-1 transition-all"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                    {operator.initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-100">{operator.name}</h3>
                    <p className="text-xs text-slate-500">{operator.role}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-cyan-500">{operator.eventsThisYear}</div>
                    <div className="text-xs text-slate-400 mt-1">Events This Year</div>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-cyan-500">{operator.avgRating}</div>
                    <div className="text-xs text-slate-400 mt-1">Avg Rating</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {operator.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-xs text-cyan-500"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Availability */}
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    operator.available
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      operator.available ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className={`text-xs ${operator.available ? 'text-green-500' : 'text-red-500'}`}>
                    {operator.availabilityStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {activeView === 'table' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Operator
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Role
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Skills
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Events
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Rating
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operatorData.map((operator) => (
                    <tr
                      key={operator.id}
                      className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                            {operator.initials}
                          </div>
                          <span className="text-sm font-medium text-slate-100">{operator.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{operator.role}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {operator.skills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded text-xs text-cyan-500"
                            >
                              {skill}
                            </span>
                          ))}
                          {operator.skills.length > 2 && (
                            <span className="px-2 py-1 text-xs text-slate-500">
                              +{operator.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{operator.eventsThisYear}</td>
                      <td className="px-5 py-4 text-sm text-cyan-500 font-semibold">{operator.avgRating}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            operator.available
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {operator.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
