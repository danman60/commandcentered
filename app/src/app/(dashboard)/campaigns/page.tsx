'use client';

import { useState } from 'react';
import Link from 'next/link';

type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'COMPLETED';

interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  lastSentAt: string;
  status: CampaignStatus;
  progress: number;
  sent: number;
  total: number;
  opened: number;
  replied: number;
  opportunities: number;
  revenue: number;
}

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  // Mock data for demonstration
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Spring Recital 2025 Outreach',
      createdAt: 'Nov 10',
      lastSentAt: '2 hours ago',
      status: 'ACTIVE',
      progress: 45,
      sent: 127,
      total: 180,
      opened: 89,
      replied: 12,
      opportunities: 3,
      revenue: 8400,
    },
    {
      id: '2',
      name: 'Summer Camp Services',
      createdAt: 'Nov 5',
      lastSentAt: '3 days ago',
      status: 'PAUSED',
      progress: 18,
      sent: 43,
      total: 240,
      opened: 31,
      replied: 5,
      opportunities: 1,
      revenue: 2800,
    },
    {
      id: '3',
      name: 'Competition Season Announcement',
      createdAt: 'Oct 28',
      lastSentAt: '1 week ago',
      status: 'COMPLETED',
      progress: 100,
      sent: 156,
      total: 156,
      opened: 134,
      replied: 23,
      opportunities: 7,
      revenue: 18200,
    },
    {
      id: '4',
      name: 'Holiday Event Specials',
      createdAt: 'Oct 15',
      lastSentAt: 'Never',
      status: 'DRAFT',
      progress: 0,
      sent: 0,
      total: 200,
      opened: 0,
      replied: 0,
      opportunities: 0,
      revenue: 0,
    },
  ];

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map((c) => c.id));
    }
  };

  const getStatusBadgeStyle = (status: CampaignStatus) => {
    const styles = {
      ACTIVE: 'bg-green-500/10 text-green-500 border-green-500/30',
      PAUSED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      COMPLETED: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
    };
    return styles[status];
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📧</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              Campaigns
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              + Create Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Filters Bar */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-sent">Most Sent</option>
            <option value="highest-reply">Highest Reply Rate</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/80 border-b border-slate-700/30">
                <tr>
                  <th className="px-5 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.length === campaigns.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded accent-cyan-500"
                    />
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                    Opened
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                    Replied
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                    Opportunities
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors"
                  >
                    <td className="px-5 py-5">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={() => handleCampaignSelect(campaign.id)}
                        className="w-4 h-4 rounded accent-cyan-500"
                      />
                    </td>
                    <td className="px-5 py-5">
                      <Link href={`/campaigns/${campaign.id}`}>
                        <div className="text-sm font-semibold text-slate-100 hover:text-cyan-500 cursor-pointer">
                          {campaign.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Created {campaign.createdAt} • Last sent {campaign.lastSentAt}
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-block px-3 py-1 border rounded text-xs font-semibold uppercase ${getStatusBadgeStyle(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="w-full bg-slate-900/60 rounded-full h-1.5 mb-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-400">{campaign.progress}% complete</div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="text-sm font-semibold text-slate-100">{campaign.sent}</div>
                      <div className="text-xs text-slate-500">of {campaign.total}</div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="text-sm font-semibold text-slate-100">{campaign.opened}</div>
                      <div className="text-xs text-cyan-500">
                        {campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="text-sm font-semibold text-slate-100">{campaign.replied}</div>
                      <div className="text-xs text-cyan-500">
                        {campaign.sent > 0 ? ((campaign.replied / campaign.sent) * 100).toFixed(1) : 0}%
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="text-sm font-semibold text-slate-100">{campaign.opportunities}</div>
                      <div className="text-xs text-green-500">${campaign.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex gap-2">
                        <button
                          title="View Analytics"
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/30 border border-slate-700/50 rounded hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all"
                        >
                          📊
                        </button>
                        <button
                          title={campaign.status === 'ACTIVE' ? 'Pause Campaign' : 'Resume Campaign'}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/30 border border-slate-700/50 rounded hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all"
                        >
                          {campaign.status === 'ACTIVE' ? '⏸️' : '▶️'}
                        </button>
                        <button
                          title="More Options"
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/30 border border-slate-700/50 rounded hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all"
                        >
                          ⋯
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">📧</div>
            <p className="text-lg">No campaigns yet</p>
            <p className="text-sm mt-2">Create your first campaign to start reaching out to leads</p>
          </div>
        )}
      </div>
    </div>
  );
}
