'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

type ViewMode = 'card' | 'table' | 'calendar';

interface OperatorFormData {
  name: string;
  email: string;
  phone: string;
  hourlyRate: number;
  primaryRole: string;
  bio: string;
  portfolioUrl: string;
}

export default function OperatorsPage() {
  const [activeView, setActiveView] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);

  // Fetch operators with real data
  const { data: operators, isLoading, refetch } = trpc.operator.list.useQuery({
    search: searchQuery || undefined,
  });

  // Create operator mutation
  const createOperator = trpc.operator.create.useMutation({
    onSuccess: () => {
      setShowCreateModal(false);
      // Refetch operators list
      refetch();
    },
  });

  // Transform data for UI display
  const operatorData = operators?.map((op) => {
    // Generate initials from name
    const nameParts = op.name.split(' ');
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : op.name.substring(0, 2).toUpperCase();

    // Count events this year from shift assignments
    const eventsThisYear = op._count.shiftAssignments;

    // Get skills from OperatorSkill relations
    const skills = op.skills?.map((s) => s.skillDefinition?.skillName || 'Unknown') || [];

    // Determine availability status
    const hasAvailability = op.availability && op.availability.length > 0;
    const available = hasAvailability;
    const availabilityStatus = available ? 'Available' : 'No availability set';

    return {
      id: op.id,
      initials,
      name: op.name,
      email: op.email,
      phone: op.phone || '-',
      role: skills[0] || 'Operator', // Use first skill as primary role
      hourlyRate: Number(op.hourlyRate),
      eventsThisYear,
      avgRating: 0, // TODO: Implement rating system
      skills: skills.slice(0, 5), // Top 5 skills
      availabilityStatus,
      available,
      availability: op.availability || [],
    };
  }) || [];

  // Generate calendar days (December 2025) with real availability
  const generateCalendarDays = () => {
    const days = [];
    const year = 2025;
    const month = 11; // December (0-indexed)

    // Get first day of month to calculate offset
    const firstDay = new Date(year, month, 1);
    const dayOffset = firstDay.getDay(); // 0 = Sunday

    // Add previous month days
    for (let i = dayOffset - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ day: prevDate.getDate(), otherMonth: true, operators: [] as string[], date: prevDate });
    }

    // Add current month days (1-31)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateString = currentDate.toISOString().split('T')[0];

      // Find operators available on this date
      const availableOps = operatorData
        .filter((op) => {
          return op.availability.some((avail) => {
            const availDate = new Date(avail.date).toISOString().split('T')[0];
            return availDate === dateString && avail.availableType !== 'unavailable';
          });
        })
        .map((op) => op.initials);

      days.push({ day: i, otherMonth: false, operators: availableOps, date: currentDate });
    }

    // Add next month days to fill grid
    const remainingCells = 35 - days.length; // 5 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ day: i, otherMonth: true, operators: [] as string[], date: nextDate });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleCreateOperator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createOperator.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      hourlyRate: Number(formData.get('hourlyRate')),
      primaryRole: formData.get('primaryRole') as string,
      bio: formData.get('bio') as string,
      portfolioUrl: formData.get('portfolioUrl') as string || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-slate-400">Loading operators...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">👷</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-purple-600 bg-clip-text text-transparent">
              Operators
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              📊 Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
            >
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
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
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
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
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
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-800/80'
            }`}
          >
            📅 Calendar View
          </button>
        </div>

        {/* Empty State */}
        {operatorData.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">👷</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">No Operators Yet</h2>
            <p className="text-slate-400 mb-6">Add your first operator to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
            >
              ➕ Add Operator
            </button>
          </div>
        )}

        {/* Calendar View */}
        {activeView === 'calendar' && operatorData.length > 0 && (
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
                <div key={day} className="bg-slate-900/80 p-3 text-center text-xs font-semibold text-green-500 uppercase">
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
                        className="inline-block px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 rounded text-xs font-semibold text-white"
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
        {activeView === 'card' && operatorData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {operatorData.map((operator) => (
              <div
                key={operator.id}
                onClick={() => {
                  setSelectedOperatorId(operator.id);
                  setShowDetailModal(true);
                }}
                className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 hover:border-green-500/50 hover:-translate-y-1 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
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
                    <div className="text-xl font-bold text-green-500">{operator.eventsThisYear}</div>
                    <div className="text-xs text-slate-400 mt-1">Events This Year</div>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-green-500">${operator.hourlyRate}/hr</div>
                    <div className="text-xs text-slate-400 mt-1">Hourly Rate</div>
                  </div>
                </div>

                {/* Skills */}
                {operator.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {operator.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-500/15 border border-green-500/30 rounded-full text-xs text-green-500"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Availability */}
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    operator.available
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-yellow-500/10 border border-yellow-500/30'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      operator.available ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  <span className={`text-xs ${operator.available ? 'text-green-500' : 'text-yellow-500'}`}>
                    {operator.availabilityStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {activeView === 'table' && operatorData.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                      Operator
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                      Role
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                      Skills
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                      Events
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                      Rate
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operatorData.map((operator) => (
                    <tr
                      key={operator.id}
                      onClick={() => {
                        setSelectedOperatorId(operator.id);
                        setShowDetailModal(true);
                      }}
                      className="border-b border-slate-700/20 hover:bg-green-500/5 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                            {operator.initials}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-100">{operator.name}</div>
                            <div className="text-xs text-slate-500">{operator.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{operator.role}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {operator.skills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-500/15 border border-green-500/30 rounded text-xs text-green-500"
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
                      <td className="px-5 py-4 text-sm text-green-500 font-semibold">${operator.hourlyRate}/hr</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            operator.available
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}
                        >
                          {operator.available ? 'Available' : 'No Availability'}
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

      {/* Create Operator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border-b border-green-500/30 p-6">
              <h2 className="text-2xl font-bold text-slate-100">Add New Operator</h2>
            </div>

            <form onSubmit={handleCreateOperator} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="John Davis"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hourly Rate ($) *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="50.00"
                />
              </div>

              {/* Primary Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Primary Role
                </label>
                <input
                  type="text"
                  name="primaryRole"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="Lead Videographer"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="Brief description of operator experience..."
                />
              </div>

              {/* Portfolio URL */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="https://portfolio.example.com"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOperator.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {createOperator.isPending ? 'Creating...' : 'Create Operator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Operator Detail Modal */}
      {showDetailModal && selectedOperatorId && (() => {
        const operator = operatorData.find(op => op.id === selectedOperatorId);
        if (!operator) return null;

        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border-b border-green-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                      {operator.initials}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{operator.name}</h2>
                      <p className="text-slate-400">{operator.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-slate-400 hover:text-white text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Email</p>
                      <p className="text-white">{operator.email}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Phone</p>
                      <p className="text-white">{operator.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Hourly Rate</p>
                      <p className="text-2xl font-bold text-green-400">${operator.hourlyRate.toFixed(2)}/hr</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Events This Year</p>
                      <p className="text-2xl font-bold text-green-400">{operator.eventsThisYear}</p>
                    </div>
                  </div>
                </div>

                {/* Skills & Certifications */}
                {operator.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Skills & Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {operator.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability Status */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Availability
                  </h3>
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${operator.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <p className="text-white">{operator.availabilityStatus}</p>
                    </div>
                    {operator.availability.length > 0 && (
                      <p className="text-sm text-slate-400 mt-2">
                        {operator.availability.length} availability {operator.availability.length === 1 ? 'entry' : 'entries'} set
                      </p>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Performance Metrics
                  </h3>
                  <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400">Average Rating: Coming soon</p>
                    <p className="text-sm text-slate-400 mt-1">Client Feedback: Coming soon</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-700/30 p-6 flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all"
                >
                  Close
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all"
                >
                  Edit Operator
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
