'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { trpc } from '@/lib/trpc/client';
import { ClientCard, RevenueSummaryCards, LogContactModal, SendEmailModal } from '@/components/pipeline';
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  X,
  LayoutGrid,
  Table as TableIcon,
  Columns,
} from 'lucide-react';

// Lead status columns for pipeline view
const PIPELINE_STAGES = [
  { id: 'NEW', label: 'New', color: 'bg-gray-600' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-blue-600' },
  { id: 'QUALIFIED', label: 'Qualified', color: 'bg-cyan-600' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'bg-purple-600' },
  { id: 'ENGAGED', label: 'Engaged', color: 'bg-yellow-600' },
  { id: 'CONVERTED', label: 'Converted', color: 'bg-green-600' },
] as const;

type LeadStatus = typeof PIPELINE_STAGES[number]['id'];
type ViewMode = 'kanban' | 'card' | 'table';

export default function PipelinePage() {
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [logContactLeadId, setLogContactLeadId] = useState<string | null>(null);
  const [sendEmailLeadId, setSendEmailLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [temperatureFilter, setTemperatureFilter] = useState<string>(() => {
    // Load saved temperature filter from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pipeline-temperature-filter') || '';
    }
    return '';
  });
  const [sortBy, setSortBy] = useState<string>(() => {
    // Load saved sort preference from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pipeline-sort-by') || '';
    }
    return '';
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Load saved view mode from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pipeline-view-mode');
      if (saved === 'kanban' || saved === 'card' || saved === 'table') {
        return saved;
      }
    }
    return 'kanban';
  });
  const [quickFilter, setQuickFilter] = useState<string>(() => {
    // Load saved quick filter from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pipeline-quick-filter') || '';
    }
    return '';
  });

  // Save filter preferences
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pipeline-view-mode', viewMode);
      localStorage.setItem('pipeline-temperature-filter', temperatureFilter);
      localStorage.setItem('pipeline-sort-by', sortBy);
      localStorage.setItem('pipeline-quick-filter', quickFilter);
    }
  }, [viewMode, temperatureFilter, sortBy, quickFilter]);

  // Fetch leads
  const { data: allLeads, refetch: refetchLeads } = trpc.lead.list.useQuery({
    search: searchQuery || undefined,
    productName: productFilter || undefined,
  });

  // Filter and sort leads
  const leads = (() => {
    // First filter by temperature
    let filtered = allLeads?.filter(lead => {
      if (!temperatureFilter) return true;
      return lead.temperature === temperatureFilter;
    }) || [];

    // Apply quick filter
    if (quickFilter) {
      filtered = filtered.filter(lead => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalRevenue = lead.leadProducts?.reduce(
          (sum, p) => sum + Number(p.revenueAmount || 0) + Number(p.projectedRevenue || 0),
          0
        ) || 0;

        switch (quickFilter) {
          case 'needsFollowUp':
            if (!lead.nextFollowUpAt) return false;
            const followUpDate = new Date(lead.nextFollowUpAt);
            followUpDate.setHours(0, 0, 0, 0);
            return followUpDate <= today;

          case 'hotLeads':
            return lead.temperature === 'Hot Lead';

          case 'highValue':
            return totalRevenue >= 10000;

          case 'noContact':
            return !lead.lastContactedAt;

          case 'activeWeek':
            if (!lead.lastContactedAt) return false;
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(lead.lastContactedAt) >= weekAgo;

          case 'needsContact':
            // Check if lead needs contact based on frequency setting
            if (!lead.contactFrequency || !lead.lastContactedAt) return false;
            const lastContact = new Date(lead.lastContactedAt);
            const now = new Date();
            const daysSinceContact = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
            const frequency = lead.contactFrequency.toLowerCase();
            let expectedDays = 0;
            if (frequency.includes('daily')) expectedDays = 1;
            else if (frequency.includes('weekly')) expectedDays = 7;
            else if (frequency.includes('biweekly') || frequency.includes('bi-weekly')) expectedDays = 14;
            else if (frequency.includes('monthly')) expectedDays = 30;
            else if (frequency.includes('quarterly')) expectedDays = 90;
            else return false;
            // Return true if overdue (beyond expected) or needs attention (within 3 days of expected)
            return daysSinceContact > expectedDays - 3;

          default:
            return true;
        }
      });
    }

    // Then sort
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'lastContacted':
            // Oldest first (nulls last)
            if (!a.lastContactedAt) return 1;
            if (!b.lastContactedAt) return -1;
            return new Date(a.lastContactedAt).getTime() - new Date(b.lastContactedAt).getTime();

          case 'nextFollowUp':
            // Upcoming first (nulls last)
            if (!a.nextFollowUpAt) return 1;
            if (!b.nextFollowUpAt) return -1;
            return new Date(a.nextFollowUpAt).getTime() - new Date(b.nextFollowUpAt).getTime();

          case 'revenue':
            // Highest first
            const aRevenue = (a.leadProducts?.reduce(
              (sum, p) => sum + Number(p.revenueAmount || 0) + Number(p.projectedRevenue || 0),
              0
            ) || 0);
            const bRevenue = (b.leadProducts?.reduce(
              (sum, p) => sum + Number(p.revenueAmount || 0) + Number(p.projectedRevenue || 0),
              0
            ) || 0);
            return bRevenue - aRevenue;

          case 'name':
            // A-Z alphabetical
            return (a.organization || '').localeCompare(b.organization || '');

          default:
            return 0;
        }
      });
    }

    return filtered;
  })();

  // Get leads by status
  const getLeadsByStatus = (status: LeadStatus) => {
    return leads?.filter(lead => lead.status === status) ?? [];
  };

  // Calculate temperature counts
  const temperatureCounts = React.useMemo(() => {
    const counts = {
      hot: 0,
      warm: 0,
      cold: 0,
      none: 0,
    };

    allLeads?.forEach((lead) => {
      if (lead.temperature === 'Hot Lead') counts.hot++;
      else if (lead.temperature === 'Warm Lead') counts.warm++;
      else if (lead.temperature === 'Cold Lead') counts.cold++;
      else counts.none++;
    });

    return counts;
  }, [allLeads]);

  // Export leads to CSV
  const handleExport = () => {
    if (!leads || leads.length === 0) return;

    // Build CSV header
    const headers = [
      'Organization',
      'Contact Name',
      'Email',
      'Phone',
      'Temperature',
      'Status',
      'Last Contacted',
      'Next Follow-Up',
      'Contact Frequency',
      'Products',
      'Total Revenue',
      'Projected Revenue',
    ];

    // Build CSV rows
    const rows = leads.map((lead) => {
      const totalRevenue = lead.leadProducts?.reduce(
        (sum, p) => sum + Number(p.revenueAmount || 0),
        0
      ) || 0;
      const projectedRevenue = lead.leadProducts?.reduce(
        (sum, p) => sum + Number(p.projectedRevenue || 0),
        0
      ) || 0;
      const productList = lead.leadProducts?.map(p => `${p.productName} (${p.status})`).join('; ') || '';

      return [
        lead.organization || '',
        lead.contactName || '',
        lead.email,
        lead.phone || '',
        lead.temperature || '',
        lead.status,
        lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString() : '',
        lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleDateString() : '',
        lead.contactFrequency || '',
        productList,
        totalRevenue.toString(),
        projectedRevenue.toString(),
      ];
    });

    // Combine into CSV string
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pipeline-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Allow Escape to clear focus
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          setIsNewLeadOpen(true);
          break;
        case 'e':
          e.preventDefault();
          handleExport();
          break;
        case '/':
          e.preventDefault();
          document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus();
          break;
        case 'escape':
          e.preventDefault();
          setSearchQuery('');
          setProductFilter('');
          setTemperatureFilter('');
          setSortBy('');
          setQuickFilter('');
          break;
        case '1':
          e.preventDefault();
          setViewMode('kanban');
          break;
        case '2':
          e.preventDefault();
          setViewMode('card');
          break;
        case '3':
          e.preventDefault();
          setViewMode('table');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleExport]);

  // Calculate total pipeline value
  const totalPipelineValue = React.useMemo(() => {
    if (!allLeads) return 0;
    return allLeads.reduce((total, lead) => {
      const leadValue = lead.leadProducts?.reduce(
        (sum, p) => sum + Number(p.revenueAmount || 0) + Number(p.projectedRevenue || 0),
        0
      ) || 0;
      return total + leadValue;
    }, 0);
  }, [allLeads]);

  // Highlight search matches
  const highlightMatch = (text: string | null | undefined): React.ReactNode => {
    if (!searchQuery || !text) return text || '';

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 -mx-8 px-8 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white">Pipeline</h1>
              {allLeads && allLeads.length > 0 && (
                <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg">
                  <div className="text-xs text-gray-400 uppercase font-semibold">Total Value</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    ${totalPipelineValue.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
            <p className="text-gray-400 mt-1">Manage leads and track opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggles */}
            <div className="flex bg-slate-800/50 border border-slate-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 rounded flex items-center gap-2 transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>📇</span>
                <span className="text-sm font-medium">Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 rounded flex items-center gap-2 transition-all ${
                  viewMode === 'card'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>📊</span>
                <span className="text-sm font-medium">Card</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded flex items-center gap-2 transition-all ${
                  viewMode === 'table'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>📋</span>
                <span className="text-sm font-medium">Table</span>
              </button>
            </div>

            <Button
              variant="secondary"
              size="medium"
              onClick={handleExport}
              disabled={!leads || leads.length === 0}
            >
              <TrendingUp className="w-4 h-4" />
              📊 Export
            </Button>

            {/* Keyboard Shortcuts Help */}
            <div className="relative group">
              <button
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white border border-slate-600 rounded-lg transition-colors"
                title="Keyboard Shortcuts"
              >
                <span className="text-sm">⌨️</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <div className="text-sm font-semibold text-white mb-3 border-b border-slate-700 pb-2">
                  Keyboard Shortcuts
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">New Lead</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded border border-slate-600">N</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Export CSV</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded border border-slate-600">E</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Focus Search</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded border border-slate-600">/</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Clear Filters</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded border border-slate-600">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Kanban View</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded border border-slate-600">1</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Card View</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded border border-slate-600">2</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Table View</span>
                    <kbd className="px-2 py-1 bg-slate-700 text-gray-300 rounded border border-slate-600">3</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Status Legend */}
            <div className="relative group">
              <button
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white border border-slate-600 rounded-lg transition-colors"
                title="Product Status Guide"
              >
                <span className="text-sm">📦</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <div className="text-sm font-semibold text-white mb-3 border-b border-slate-700 pb-2">
                  Product Status Guide
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-xs whitespace-nowrap">
                      Discussing
                    </span>
                    <span className="text-gray-400">Initial conversations about product</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs whitespace-nowrap">
                      Proposal
                    </span>
                    <span className="text-gray-400">Formal proposal has been sent</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs whitespace-nowrap">
                      Won
                    </span>
                    <span className="text-gray-400">Deal closed successfully</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs whitespace-nowrap">
                      Lost
                    </span>
                    <span className="text-gray-400">Opportunity was lost</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded text-xs whitespace-nowrap">
                      Not Interested
                    </span>
                    <span className="text-gray-400">Client not interested in this product</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-gray-600/20 text-gray-500 border border-gray-600/30 rounded text-xs whitespace-nowrap">
                      Not Applicable
                    </span>
                    <span className="text-gray-400">Product doesn't apply to this client</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="medium"
              onClick={() => setIsNewLeadOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card padding="medium" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by organization, contact, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <select
            value={temperatureFilter}
            onChange={(e) => setTemperatureFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Statuses</option>
            <option value="Hot Lead">Hot Leads</option>
            <option value="Warm Lead">Warm Leads</option>
            <option value="Cold Lead">Cold Leads</option>
          </select>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Products</option>
            <option value="Studio Sage">Studio Sage</option>
            <option value="Dance Recital">Dance Recital</option>
            <option value="Competition Software">Competition Software</option>
            <option value="Core Video">Core Video</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Sort by...</option>
            <option value="lastContacted">Last Contacted (Oldest)</option>
            <option value="nextFollowUp">Next Follow-Up (Upcoming)</option>
            <option value="revenue">Revenue Potential (Highest)</option>
            <option value="name">Client Name (A-Z)</option>
          </select>
        </div>
      </Card>

      {/* Temperature Distribution Badges */}
      {allLeads && allLeads.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-400">Pipeline Distribution:</span>
          <button
            onClick={() => setTemperatureFilter('Hot Lead')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              temperatureFilter === 'Hot Lead'
                ? 'bg-red-500/30 text-red-300 border-red-500/50'
                : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            🔥 Hot: {temperatureCounts.hot}
          </button>
          <button
            onClick={() => setTemperatureFilter('Warm Lead')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              temperatureFilter === 'Warm Lead'
                ? 'bg-orange-500/30 text-orange-300 border-orange-500/50'
                : 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20'
            }`}
          >
            🟠 Warm: {temperatureCounts.warm}
          </button>
          <button
            onClick={() => setTemperatureFilter('Cold Lead')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              temperatureFilter === 'Cold Lead'
                ? 'bg-blue-500/30 text-blue-300 border-blue-500/50'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
            }`}
          >
            🔵 Cold: {temperatureCounts.cold}
          </button>
          {temperatureCounts.none > 0 && (
            <button
              onClick={() => setTemperatureFilter('')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                temperatureFilter === ''
                  ? 'bg-gray-500/30 text-gray-300 border-gray-500/50'
                  : 'bg-gray-500/10 text-gray-400 border-gray-500/30 hover:bg-gray-500/20'
              }`}
            >
              ⚪ Unclassified: {temperatureCounts.none}
            </button>
          )}
          {temperatureFilter && (
            <button
              onClick={() => setTemperatureFilter('')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {allLeads && allLeads.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/30 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              Showing <span className="font-semibold text-white">{leads?.length || 0}</span> of{' '}
              <span className="font-semibold text-white">{allLeads.length}</span> leads
            </span>
            {(searchQuery || productFilter || temperatureFilter || sortBy || quickFilter) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">|</span>
                <span className="text-xs text-gray-500">Active filters:</span>
                {quickFilter && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400">
                    <span>
                      Quick:{' '}
                      {quickFilter === 'needsFollowUp' && 'Needs Follow-Up'}
                      {quickFilter === 'hotLeads' && 'Hot Leads'}
                      {quickFilter === 'highValue' && 'High Value'}
                      {quickFilter === 'noContact' && 'No Contact'}
                      {quickFilter === 'activeWeek' && 'Active This Week'}
                      {quickFilter === 'needsContact' && 'Needs Contact'}
                    </span>
                    <button
                      onClick={() => setQuickFilter('')}
                      className="hover:text-cyan-300"
                      title="Clear quick filter"
                    >
                      ×
                    </button>
                  </div>
                )}
                {searchQuery && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400">
                    <span>Search: "{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-cyan-300"
                      title="Clear search"
                    >
                      ×
                    </button>
                  </div>
                )}
                {productFilter && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-400">
                    <span>Product: {productFilter}</span>
                    <button
                      onClick={() => setProductFilter('')}
                      className="hover:text-purple-300"
                      title="Clear product filter"
                    >
                      ×
                    </button>
                  </div>
                )}
                {temperatureFilter && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-400">
                    <span>Temperature: {temperatureFilter}</span>
                    <button
                      onClick={() => setTemperatureFilter('')}
                      className="hover:text-orange-300"
                      title="Clear temperature filter"
                    >
                      ×
                    </button>
                  </div>
                )}
                {sortBy && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-400">
                    <span>
                      Sort:{' '}
                      {sortBy === 'lastContacted' && 'Last Contacted'}
                      {sortBy === 'nextFollowUp' && 'Next Follow-Up'}
                      {sortBy === 'revenue' && 'Revenue'}
                      {sortBy === 'name' && 'Name'}
                    </span>
                    <button
                      onClick={() => setSortBy('')}
                      className="hover:text-blue-300"
                      title="Clear sort"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {(searchQuery || productFilter || temperatureFilter || sortBy || quickFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setProductFilter('');
                setTemperatureFilter('');
                setSortBy('');
                setQuickFilter('');
              }}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded text-xs font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Revenue Summary Cards */}
      {leads && leads.length > 0 && <RevenueSummaryCards leads={leads as any} />}

      {/* Quick Filters */}
      {allLeads && allLeads.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400 font-medium mr-2">Quick Filters:</span>
            <button
              onClick={() => setQuickFilter(quickFilter === 'needsFollowUp' ? '' : 'needsFollowUp')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'needsFollowUp'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 border border-slate-600'
              }`}
            >
              🔔 Needs Follow-Up
            </button>
            <button
              onClick={() => setQuickFilter(quickFilter === 'hotLeads' ? '' : 'hotLeads')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'hotLeads'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 border border-slate-600'
              }`}
            >
              🔥 Hot Leads
            </button>
            <button
              onClick={() => setQuickFilter(quickFilter === 'highValue' ? '' : 'highValue')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'highValue'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 border border-slate-600'
              }`}
            >
              💎 High Value ($10k+)
            </button>
            <button
              onClick={() => setQuickFilter(quickFilter === 'noContact' ? '' : 'noContact')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'noContact'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 border border-slate-600'
              }`}
            >
              📭 No Contact Yet
            </button>
            <button
              onClick={() => setQuickFilter(quickFilter === 'activeWeek' ? '' : 'activeWeek')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'activeWeek'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 border border-slate-600'
              }`}
            >
              ⚡ Active This Week
            </button>
            <button
              onClick={() => setQuickFilter(quickFilter === 'needsContact' ? '' : 'needsContact')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                quickFilter === 'needsContact'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 border border-slate-600'
              }`}
            >
              📞 Needs Contact
            </button>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = getLeadsByStatus(stage.id);
            return (
              <div key={stage.id} className="flex flex-col">
                {/* Column Header */}
                <div className={`${stage.color} bg-opacity-20 border border-opacity-30 ${stage.color.replace('bg-', 'border-')} rounded-t-lg p-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{stage.label}</h3>
                    <span className={`${stage.color} text-white text-xs px-2 py-1 rounded-full`}>
                      {stageLeads.length}
                    </span>
                  </div>
                </div>

                {/* Lead Cards */}
                <div className="flex-1 bg-slate-800/30 border border-slate-700 border-t-0 rounded-b-lg p-2 space-y-2 min-h-[500px] max-h-[600px] overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      padding="small"
                      hover="lift"
                      className="cursor-pointer"
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <h4 className="font-medium text-white text-sm mb-1">
                        {highlightMatch(lead.organization)}
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">{highlightMatch(lead.contactName)}</p>

                      {lead.leadProducts && lead.leadProducts.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lead.leadProducts.slice(0, 2).map((product) => (
                            <span
                              key={product.productName}
                              className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded"
                            >
                              {product.productName}
                            </span>
                          ))}
                          {lead.leadProducts.length > 2 && (
                            <span className="text-xs px-2 py-1 bg-gray-600/20 text-gray-400 rounded">
                              +{lead.leadProducts.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <div className="text-3xl mb-2 opacity-30">📭</div>
                      <p className="text-xs text-center">No leads yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Card View - Product-Focused */}
      {viewMode === 'card' && (
        <div className="space-y-4">
          {leads?.map((lead) => (
            <ClientCard
              key={lead.id}
              lead={lead as any}
              onLogContact={() => setLogContactLeadId(lead.id)}
              onSendEmail={() => setSendEmailLeadId(lead.id)}
              onViewDetails={() => setSelectedLeadId(lead.id)}
              onProductUpdate={() => refetchLeads()}
              searchQuery={searchQuery}
            />
          ))}
          {(!leads || leads.length === 0) && (
            <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700">
              {allLeads && allLeads.length > 0 ? (
                <div className="max-w-md mx-auto">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No matching leads</h3>
                  <p className="text-gray-400 mb-4">
                    Try adjusting your filters or search terms to see more results.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setProductFilter('');
                      setTemperatureFilter('');
                      setSortBy('');
                      setQuickFilter('');
                    }}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Your pipeline is empty</h3>
                  <p className="text-gray-400 mb-4">
                    Start building your sales pipeline by adding your first lead.
                  </p>
                  <button
                    onClick={() => setIsNewLeadOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg transition-colors shadow-lg shadow-cyan-500/30"
                  >
                    ➕ Add Your First Lead
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/80 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase">Organization</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase">Products</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leads?.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className="hover:bg-cyan-500/5 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium">{lead.organization}</td>
                    <td className="px-4 py-3 text-gray-400">{lead.contactName}</td>
                    <td className="px-4 py-3 text-gray-400">{lead.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-400">{lead.phone || '-'}</td>
                    <td className="px-4 py-3">
                      {lead.leadProducts && lead.leadProducts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {lead.leadProducts.slice(0, 2).map((product) => (
                            <span
                              key={product.productName}
                              className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded"
                            >
                              {product.productName}
                            </span>
                          ))}
                          {lead.leadProducts.length > 2 && (
                            <span className="text-xs px-2 py-1 bg-gray-600/20 text-gray-400 rounded">
                              +{lead.leadProducts.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          PIPELINE_STAGES.find(s => s.id === lead.status)?.color || 'bg-gray-600'
                        } bg-opacity-20 ${
                          PIPELINE_STAGES.find(s => s.id === lead.status)?.color.replace('bg-', 'text-') || 'text-gray-400'
                        }`}
                      >
                        {PIPELINE_STAGES.find(s => s.id === lead.status)?.label}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!leads || leads.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16">
                      <div className="text-center">
                        {allLeads && allLeads.length > 0 ? (
                          <div className="max-w-md mx-auto">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-white mb-2">No matching leads</h3>
                            <p className="text-gray-400 mb-4">
                              Try adjusting your filters or search terms to see more results.
                            </p>
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setProductFilter('');
                                setTemperatureFilter('');
                                setSortBy('');
                                setQuickFilter('');
                              }}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                            >
                              Clear All Filters
                            </button>
                          </div>
                        ) : (
                          <div className="max-w-md mx-auto">
                            <div className="text-5xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Your pipeline is empty</h3>
                            <p className="text-gray-400 mb-4">
                              Start building your sales pipeline by adding your first lead.
                            </p>
                            <button
                              onClick={() => setIsNewLeadOpen(true)}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg transition-colors shadow-lg shadow-cyan-500/30"
                            >
                              ➕ Add Your First Lead
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Lead Modal */}
      {isNewLeadOpen && (
        <NewLeadModal
          isOpen={isNewLeadOpen}
          onClose={() => setIsNewLeadOpen(false)}
          onSuccess={() => {
            refetchLeads();
            setIsNewLeadOpen(false);
          }}
        />
      )}

      {/* Lead Detail Modal */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          isOpen={!!selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onSuccess={() => {
            refetchLeads();
            setSelectedLeadId(null);
          }}
        />
      )}

      {/* Log Contact Modal */}
      {logContactLeadId && (
        <LogContactModal
          isOpen={!!logContactLeadId}
          onClose={() => setLogContactLeadId(null)}
          lead={allLeads?.find(l => l.id === logContactLeadId) as any}
          onSuccess={() => {
            refetchLeads();
            setLogContactLeadId(null);
          }}
        />
      )}

      {/* Send Email Modal */}
      {sendEmailLeadId && (
        <SendEmailModal
          isOpen={!!sendEmailLeadId}
          onClose={() => setSendEmailLeadId(null)}
          lead={allLeads?.find(l => l.id === sendEmailLeadId) as any}
        />
      )}
    </div>
  );
}

// New Lead Modal Component
function NewLeadModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    source: '',
    sourceDetails: '',
  });

  const createLead = trpc.lead.create.useMutation({
    onSuccess: () => onSuccess(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(formData);
  };

  return (
    <Modal title="New Lead" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Organization *
          </label>
          <input
            type="text"
            required
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Company or studio name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            required
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Primary contact person"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Source
          </label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select source...</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Outreach">Cold Outreach</option>
            <option value="Trade Show">Trade Show</option>
            <option value="Social Media">Social Media</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.source && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source Details
            </label>
            <textarea
              value={formData.sourceDetails}
              onChange={(e) => setFormData({ ...formData, sourceDetails: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Additional details about how you found this lead..."
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="secondary"
            size="medium"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={createLead.isPending}
          >
            {createLead.isPending ? 'Creating...' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Lead Detail Modal Component
// Product types
type ProductFormData = {
  productName: string;
  status: 'NOT_INTERESTED' | 'DISCUSSING' | 'PROPOSAL' | 'WON' | 'LOST';
  revenueAmount: string;
  notes: string;
  isInterested: boolean;
};

function LeadDetailModal({
  leadId,
  isOpen,
  onClose,
  onSuccess,
}: {
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { data: lead } = trpc.lead.getById.useQuery({ id: leadId });
  const updateLead = trpc.lead.update.useMutation({
    onSuccess: () => onSuccess(),
  });
  const deleteLead = trpc.lead.delete.useMutation({
    onSuccess: () => onSuccess(),
  });
  const bulkUpdateProducts = trpc.lead.bulkUpdateProducts.useMutation({
    onSuccess: () => onSuccess(),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProducts, setIsEditingProducts] = useState(false);
  const [formData, setFormData] = useState({
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    status: '' as LeadStatus | 'PROPOSAL_VIEWED' | 'PROPOSAL_SUBMITTED' | 'CONTRACT_SENT' | 'LOST',
  });
  const [productsData, setProductsData] = useState<ProductFormData[]>([]);

  // Update form when lead loads
  if (lead && formData.organization === '') {
    setFormData({
      organization: lead.organization || '',
      contactName: lead.contactName || '',
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status as any,
    });

    // Initialize products data
    if (lead.leadProducts && lead.leadProducts.length > 0) {
      setProductsData(
        lead.leadProducts.map((p: any) => ({
          productName: p.productName,
          status: p.status,
          revenueAmount: p.revenueAmount ? p.revenueAmount.toString() : '',
          notes: p.notes || '',
          isInterested: p.isInterested || false,
        }))
      );
    }
  }

  const handleSave = () => {
    updateLead.mutate({ id: leadId, ...formData });
    setIsEditing(false);
  };

  const handleSaveProducts = () => {
    bulkUpdateProducts.mutate({
      leadId,
      products: productsData.map((p) => ({
        productName: p.productName,
        status: p.status,
        isInterested: p.isInterested,
        revenueAmount: p.revenueAmount ? parseFloat(p.revenueAmount) : undefined,
        notes: p.notes || undefined,
      })),
    });
    setIsEditingProducts(false);
  };

  const handleProductChange = (index: number, field: keyof ProductFormData, value: any) => {
    const updated = [...productsData];
    updated[index] = { ...updated[index], [field]: value };
    setProductsData(updated);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this lead? This will mark it as LOST.')) {
      deleteLead.mutate({ id: leadId });
    }
  };

  if (!lead) return null;

  return (
    <Modal title={lead.organization || 'Lead Details'} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="secondary"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSave}
                  disabled={updateLead.isPending}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Organization
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <p className="text-white">{lead.organization || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Contact Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <p className="text-white">{lead.contactName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <p className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {lead.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <p className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {lead.phone || 'N/A'}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL_SENT">Proposal Sent</option>
                <option value="PROPOSAL_VIEWED">Proposal Viewed</option>
                <option value="ENGAGED">Engaged</option>
                <option value="PROPOSAL_SUBMITTED">Proposal Submitted</option>
                <option value="CONTRACT_SENT">Contract Sent</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          )}
        </div>

        {/* Products */}
        {productsData && productsData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-300">Products</h3>
              {!isEditingProducts ? (
                <Button variant="secondary" size="small" onClick={() => setIsEditingProducts(true)}>
                  Edit Products
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" size="small" onClick={() => {
                    setIsEditingProducts(false);
                    // Reset to original data
                    if (lead.leadProducts) {
                      setProductsData(
                        lead.leadProducts.map((p: any) => ({
                          productName: p.productName,
                          status: p.status,
                          revenueAmount: p.revenueAmount ? p.revenueAmount.toString() : '',
                          notes: p.notes || '',
                          isInterested: p.isInterested || false,
                        }))
                      );
                    }
                  }}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="small" onClick={handleSaveProducts} disabled={bulkUpdateProducts.isPending}>
                    {bulkUpdateProducts.isPending ? 'Saving...' : 'Save Products'}
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {productsData.map((product, index) => (
                <div
                  key={product.productName}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isEditingProducts && (
                        <input
                          type="checkbox"
                          checked={product.isInterested}
                          onChange={(e) => handleProductChange(index, 'isInterested', e.target.checked)}
                          className="w-4 h-4 rounded accent-cyan-500"
                        />
                      )}
                      <span className="text-white font-medium">{product.productName}</span>
                    </div>
                    {!isEditingProducts ? (
                      <span className={`text-xs px-3 py-1 rounded-full ${getProductStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    ) : (
                      <select
                        value={product.status}
                        onChange={(e) => handleProductChange(index, 'status', e.target.value)}
                        className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="NOT_INTERESTED">Not Interested</option>
                        <option value="DISCUSSING">Discussing</option>
                        <option value="PROPOSAL">Proposal</option>
                        <option value="WON">Won</option>
                        <option value="LOST">Lost</option>
                      </select>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Revenue</label>
                      {!isEditingProducts ? (
                        <p className="text-sm text-white flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {product.revenueAmount ? `$${parseFloat(product.revenueAmount).toLocaleString()}` : 'N/A'}
                        </p>
                      ) : (
                        <input
                          type="number"
                          value={product.revenueAmount}
                          onChange={(e) => handleProductChange(index, 'revenueAmount', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      )}
                    </div>
                  </div>
                  {isEditingProducts && (
                    <div className="mt-3">
                      <label className="block text-xs text-gray-400 mb-1">Notes</label>
                      <textarea
                        value={product.notes}
                        onChange={(e) => handleProductChange(index, 'notes', e.target.value)}
                        placeholder="Product discussion notes..."
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  )}
                  {!isEditingProducts && product.notes && (
                    <p className="text-xs text-gray-400 mt-2 italic">"{product.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Button */}
        <div className="pt-4 border-t border-slate-700">
          <Button
            variant="secondary"
            size="small"
            onClick={handleDelete}
            disabled={deleteLead.isPending}
            className="text-red-400 hover:text-red-300"
          >
            {deleteLead.isPending ? 'Deleting...' : 'Delete Lead'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Helper functions
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NEW: 'bg-gray-600/20 text-gray-400',
    CONTACTED: 'bg-blue-600/20 text-blue-400',
    QUALIFIED: 'bg-cyan-600/20 text-cyan-400',
    PROPOSAL_SENT: 'bg-purple-600/20 text-purple-400',
    PROPOSAL_VIEWED: 'bg-purple-600/20 text-purple-400',
    ENGAGED: 'bg-yellow-600/20 text-yellow-400',
    PROPOSAL_SUBMITTED: 'bg-orange-600/20 text-orange-400',
    CONTRACT_SENT: 'bg-green-600/20 text-green-400',
    CONVERTED: 'bg-green-600/20 text-green-400',
    LOST: 'bg-red-600/20 text-red-400',
  };
  return colors[status] || 'bg-gray-600/20 text-gray-400';
}

function getProductStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NOT_INTERESTED: 'bg-gray-600/20 text-gray-400',
    DISCUSSING: 'bg-blue-600/20 text-blue-400',
    PROPOSAL: 'bg-purple-600/20 text-purple-400',
    WON: 'bg-green-600/20 text-green-400',
    LOST: 'bg-red-600/20 text-red-400',
  };
  return colors[status] || 'bg-gray-600/20 text-gray-400';
}
