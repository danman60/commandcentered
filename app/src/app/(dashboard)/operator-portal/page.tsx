'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function OperatorPortalPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'profile' | 'availability'>('schedule');

  // Fetch current user's operator data
  // Note: This would need auth context to get current operator ID
  // For now, we'll show the structure

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
            <h2 className="text-xl font-bold text-green-500 mb-6">Manage Availability</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Upcoming Availability</h3>
              <p className="text-slate-400 text-sm mb-4">
                Let your admin know when you're available for work. Mark days or specific time slots.
              </p>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {/* Calendar grid placeholder */}
                {Array.from({ length: 35 }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-slate-900/60 border border-slate-700/50 rounded-lg flex items-center justify-center text-sm text-slate-400 hover:border-green-500/50 transition-all cursor-pointer"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Blackout Dates</h3>
              <p className="text-slate-400 text-sm mb-4">
                Mark dates when you're unavailable (vacation, personal days, etc.)
              </p>

              <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-6 text-center">
                <p className="text-slate-500 mb-4">No blackout dates set</p>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all">
                  ➕ Add Blackout Date
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-1">Availability System</div>
                  <div className="text-xs text-blue-400/80">
                    This feature is coming soon. For now, communicate your availability directly with your admin.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
