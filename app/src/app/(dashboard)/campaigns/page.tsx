'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';

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

  // Fetch campaigns from backend
  const { data: campaignsData = [], isLoading } = trpc.campaign.list.useQuery({
    status: statusFilter !== 'all' ? (statusFilter.toUpperCase() as any) : undefined,
    search: searchQuery || undefined,
  });

  // Transform backend data to match UI format
  const campaigns: Campaign[] = campaignsData.map((c: any) => ({
    id: c.id,
    name: c.name,
    createdAt: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    lastSentAt: c.lastSentAt
      ? formatRelativeTime(new Date(c.lastSentAt))
      : 'Never',
    status: c.status as CampaignStatus,
    progress: c.totalLeads > 0 ? Math.round((c.sentCount / c.totalLeads) * 100) : 0,
    sent: c.sentCount,
    total: c.totalLeads,
    opened: c.openedCount,
    replied: c.repliedCount,
    opportunities: 0, // TODO: Calculate from campaign leads with opportunityValue
    revenue: Number(c.revenue),
  }));

  function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  }

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
      COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/30',
    };
    return styles[status];
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📧</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-purple-600 bg-clip-text text-transparent">
              Campaigns
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all">
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
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-100 focus:outline-none focus:border-green-500"
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
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-100 focus:outline-none focus:border-green-500"
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
                      className="w-4 h-4 rounded accent-green-500"
                    />
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
                    Opened
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
                    Replied
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider">
                    Opportunities
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-slate-700/20 hover:bg-green-500/5 transition-colors"
                  >
                    <td className="px-5 py-5">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={() => handleCampaignSelect(campaign.id)}
                        className="w-4 h-4 rounded accent-green-500"
                      />
                    </td>
                    <td className="px-5 py-5">
                      <Link href={`/campaigns/${campaign.id}`}>
                        <div className="text-sm font-semibold text-slate-100 hover:text-green-500 cursor-pointer">
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
                          className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all"
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
                      <div className="text-xs text-green-500">
                        {campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="text-sm font-semibold text-slate-100">{campaign.replied}</div>
                      <div className="text-xs text-green-500">
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
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/30 border border-slate-700/50 rounded hover:bg-slate-700/50 hover:border-green-500/50 transition-all"
                        >
                          📊
                        </button>
                        <button
                          title={campaign.status === 'ACTIVE' ? 'Pause Campaign' : 'Resume Campaign'}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/30 border border-slate-700/50 rounded hover:bg-slate-700/50 hover:border-green-500/50 transition-all"
                        >
                          {campaign.status === 'ACTIVE' ? '⏸️' : '▶️'}
                        </button>
                        <button
                          title="More Options"
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/30 border border-slate-700/50 rounded hover:bg-slate-700/50 hover:border-green-500/50 transition-all"
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
