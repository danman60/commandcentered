'use client';

import { use } from 'react';
import { useState } from 'react';
import Link from 'next/link';

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'emails' | 'settings'>('overview');

  // Mock campaign data
  const campaign = {
    id,
    name: 'Spring Recital 2025 Outreach',
    status: 'ACTIVE',
    createdAt: 'Nov 10, 2025',
    progress: 45,
    sent: 127,
    total: 180,
    opened: 89,
    replied: 12,
    opportunities: 3,
    revenue: 8400,
  };

  const emailSteps = [
    {
      step: 1,
      name: 'Initial Outreach',
      subject: 'Capture Your Recital with Professional Video',
      delay: '0 days',
      sent: 127,
      opened: 89,
      replied: 12,
    },
    {
      step: 2,
      name: 'Follow-up',
      subject: 'Re: Video Services for Your Event',
      delay: '3 days',
      sent: 78,
      opened: 52,
      replied: 8,
    },
    {
      step: 3,
      name: 'Final Reminder',
      subject: 'Last Chance: Spring Recital Filming',
      delay: '7 days',
      sent: 45,
      opened: 31,
      replied: 5,
    },
  ];

  const leads = [
    {
      id: '1',
      name: 'Woodstock School of Dance',
      email: 'info@woodstockdance.com',
      status: 'REPLIED',
      lastSent: '2 hours ago',
    },
    {
      id: '2',
      name: 'EMPWR Dance Experience',
      email: 'empwrdance@gmail.com',
      status: 'OPENED',
      lastSent: '1 day ago',
    },
    {
      id: '3',
      name: 'Grand River Dance Company',
      email: 'info@grandriverdance.com',
      status: 'SENT',
      lastSent: '3 days ago',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <Link
              href="/campaigns"
              className="text-sm text-slate-400 hover:text-cyan-500 mb-2 inline-block transition-colors"
            >
              ← Back to Campaigns
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              {campaign.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Created {campaign.createdAt} • {campaign.status}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              {campaign.status === 'ACTIVE' ? '⏸️ Pause' : '▶️ Resume'}
            </button>
            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              📧 Send Test Email
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 text-center">
            <div className="text-xs text-slate-400 uppercase mb-2">Progress</div>
            <div className="text-3xl font-bold text-cyan-500 mb-2">{campaign.progress}%</div>
            <div className="w-full bg-slate-900/60 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full"
                style={{ width: `${campaign.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 text-center">
            <div className="text-xs text-slate-400 uppercase mb-2">Sent</div>
            <div className="text-3xl font-bold text-slate-100 mb-2">{campaign.sent}</div>
            <div className="text-xs text-slate-500">of {campaign.total} total</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 text-center">
            <div className="text-xs text-slate-400 uppercase mb-2">Open Rate</div>
            <div className="text-3xl font-bold text-cyan-500 mb-2">
              {Math.round((campaign.opened / campaign.sent) * 100)}%
            </div>
            <div className="text-xs text-slate-500">{campaign.opened} opened</div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 text-center">
            <div className="text-xs text-slate-400 uppercase mb-2">Revenue</div>
            <div className="text-3xl font-bold text-green-500 mb-2">${campaign.revenue.toLocaleString()}</div>
            <div className="text-xs text-slate-500">{campaign.opportunities} opportunities</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700/30">
          {(['overview', 'leads', 'emails', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-medium transition-all ${
                activeTab === tab
                  ? 'text-cyan-500 border-b-2 border-cyan-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold text-cyan-500 mb-4">Email Sequence</h2>
            <div className="space-y-4">
              {emailSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-sm font-semibold text-cyan-500 mb-1">
                        Step {step.step}: {step.name}
                      </div>
                      <div className="text-base text-slate-100">{step.subject}</div>
                      <div className="text-xs text-slate-500 mt-1">Delay: {step.delay}</div>
                    </div>
                    <button className="px-3 py-1 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded text-xs font-medium hover:bg-slate-700/50 transition-all">
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-slate-400">Sent</div>
                      <div className="text-base font-semibold text-slate-100">{step.sent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Opened</div>
                      <div className="text-base font-semibold text-cyan-500">
                        {step.opened} ({Math.round((step.opened / step.sent) * 100)}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Replied</div>
                      <div className="text-base font-semibold text-green-500">
                        {step.replied} ({((step.replied / step.sent) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div>
            <h2 className="text-xl font-bold text-cyan-500 mb-4">Campaign Leads ({leads.length})</h2>
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase">
                      Lead
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase">
                      Last Sent
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-700/20 hover:bg-cyan-500/5">
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-slate-100">{lead.name}</div>
                        <div className="text-xs text-slate-500">{lead.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            lead.status === 'REPLIED'
                              ? 'bg-green-500/10 text-green-500'
                              : lead.status === 'OPENED'
                              ? 'bg-cyan-500/10 text-cyan-500'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400">{lead.lastSent}</td>
                      <td className="px-5 py-4">
                        <button className="px-3 py-1 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded text-xs font-medium hover:bg-slate-700/50 transition-all">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Emails Tab */}
        {activeTab === 'emails' && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">📧</div>
            <p className="text-lg">Email History</p>
            <p className="text-sm mt-2">View all sent emails and their status</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">⚙️</div>
            <p className="text-lg">Campaign Settings</p>
            <p className="text-sm mt-2">Configure campaign automation and timing</p>
          </div>
        )}
      </div>
    </div>
  );
}
