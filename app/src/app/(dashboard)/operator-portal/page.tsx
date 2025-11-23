'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function OperatorPortalPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'profile' | 'availability'>('schedule');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch current user's operator data
  // Note: This would need auth context to get current operator ID
  // For demo purposes, using a placeholder operator ID
  const operatorId = 'placeholder-operator-id';

  // Get availability for current month
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const { data: availability, refetch: refetchAvailability } = trpc.operatorAvailability.getByDateRange.useQuery(
    {
      operatorId,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
    },
    {
      enabled: activeTab === 'availability',
    }
  );

  // Mutations
  const createAvailability = trpc.operatorAvailability.create.useMutation({
    onSuccess: () => {
      refetchAvailability();
      setShowAvailabilityModal(false);
      setSelectedDate(null);
    },
  });

  const deleteAvailability = trpc.operatorAvailability.delete.useMutation({
    onSuccess: () => {
      refetchAvailability();
    },
  });

  // Calendar helpers
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getAvailabilityForDate = (date: Date) => {
    if (!availability) return null;
    const dateStr = date.toISOString().split('T')[0];
    return availability.find(
      (a) => new Date(a.date).toISOString().split('T')[0] === dateStr
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAvailabilityModal(true);
  };

  const handleSetAvailability = (type: 'full_day' | 'unavailable') => {
    if (!selectedDate) return;

    createAvailability.mutate({
      operatorId,
      date: selectedDate.toISOString().split('T')[0],
      availableType: type,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-500 mb-2">Operator Portal</h1>
          <p className="text-slate-400">
            View your schedule, manage your profile, and update your availability
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📅 My Schedule
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'profile'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            👤 My Profile
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'availability'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📆 Availability
          </button>
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-green-500 mb-4">Upcoming Assignments</h2>
              <p className="text-slate-400 text-center py-12">
                Your upcoming shifts and events will appear here. Connect with your admin to get assigned to events.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-green-500 mb-4">Past Events</h2>
              <p className="text-slate-400 text-center py-12">
                Your completed assignments and event history will appear here.
              </p>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-green-500 mb-6">My Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Contact Information</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    disabled
                  />
                </div>
              </div>

              {/* Skills & Rates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Skills & Rates</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Primary Role</label>
                  <input
                    type="text"
                    placeholder="e.g., Camera Operator"
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Hourly Rate</label>
                  <input
                    type="text"
                    placeholder="$50/hour"
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-900/60 border border-slate-700/50 rounded-lg min-h-[52px]">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                      Camera Operation
                    </span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                      Live Streaming
                    </span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                      Audio
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-1">Profile Management</div>
                  <div className="text-xs text-blue-400/80">
                    To update your profile information, please contact your administrator or production coordinator.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-green-500">Manage Availability</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
                >
                  ←
                </button>
                <span className="px-4 py-1 bg-slate-700 text-white rounded">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
                >
                  →
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-slate-400 text-sm mb-4">
                Click on a date to mark your availability. Green = Available, Red = Unavailable.
              </p>

              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth().map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const avail = getAvailabilityForDate(date);
                  const isAvailable = avail?.availableType === 'full_day';
                  const isUnavailable = avail?.availableType === 'unavailable';
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                        isToday ? 'ring-2 ring-green-500' : ''
                      } ${
                        isAvailable
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                          : isUnavailable
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-slate-900/60 border border-slate-700/50 text-slate-400 hover:border-green-500/50'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-sm mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded"></div>
                <span className="text-slate-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/20 border border-red-500/30 rounded"></div>
                <span className="text-slate-400">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 ring-2 ring-green-500 rounded"></div>
                <span className="text-slate-400">Today</span>
              </div>
            </div>

            {/* Blackout Dates List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Blackout Dates</h3>
              {availability?.filter((a) => a.availableType === 'unavailable').length ?? 0 > 0 ? (
                <div className="space-y-2">
                  {availability
                    ?.filter((a) => a.availableType === 'unavailable')
                    .map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between bg-slate-900/60 border border-slate-700/50 rounded-lg p-3"
                      >
                        <div>
                          <span className="text-slate-200">
                            {new Date(a.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          {a.notes && <p className="text-sm text-slate-400 mt-1">{a.notes}</p>}
                        </div>
                        <button
                          onClick={() => deleteAvailability.mutate({ id: a.id })}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-6">No blackout dates set</p>
              )}
            </div>
          </div>
        )}

        {/* Availability Modal */}
        {showAvailabilityModal && selectedDate && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-green-500 mb-4">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>

              <p className="text-slate-400 text-sm mb-6">Set your availability for this date:</p>

              <div className="space-y-3">
                <button
                  onClick={() => handleSetAvailability('full_day')}
                  className="w-full px-4 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition font-semibold"
                >
                  ✓ Mark as Available
                </button>

                <button
                  onClick={() => handleSetAvailability('unavailable')}
                  className="w-full px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition font-semibold"
                >
                  ✗ Mark as Unavailable
                </button>

                <button
                  onClick={() => {
                    const avail = getAvailabilityForDate(selectedDate);
                    if (avail) {
                      deleteAvailability.mutate({ id: avail.id });
                    }
                    setShowAvailabilityModal(false);
                    setSelectedDate(null);
                  }}
                  className="w-full px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
                >
                  Clear Availability
                </button>

                <button
                  onClick={() => {
                    setShowAvailabilityModal(false);
                    setSelectedDate(null);
                  }}
                  className="w-full px-4 py-3 bg-slate-900 text-slate-400 rounded-lg hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
