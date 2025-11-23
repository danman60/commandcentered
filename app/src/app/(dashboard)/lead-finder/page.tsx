'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';

type BusinessType = 'dance-studio' | 'dance-school' | 'performing-arts' | 'event-venue' | 'k12-school';

interface LeadResult {
  id: string;
  name: string;
  location: string;
  website: string;
  email: string;
  employees: string;
  revenue: string;
  tags: string[];
}

export default function LeadFinderPage() {
  const [skipExisting, setSkipExisting] = useState(true);
  const [businessTypes, setBusinessTypes] = useState<Record<BusinessType, boolean>>({
    'dance-studio': true,
    'dance-school': true,
    'performing-arts': false,
    'event-venue': false,
    'k12-school': false,
  });
  const [location, setLocation] = useState('Ontario, Canada');
  const [keywords, setKeywords] = useState('recital, dance');
  const [minEmployees, setMinEmployees] = useState('10');
  const [maxEmployees, setMaxEmployees] = useState('100');
  const [minRevenue, setMinRevenue] = useState('');
  const [maxRevenue, setMaxRevenue] = useState('');
  const [hasWebsite, setHasWebsite] = useState(true);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // Fetch lead search results from backend
  const { data: leadResults = [], isLoading: isSearching } = trpc.leadFinder.search.useQuery({
    location,
    keywords,
    minEmployees,
    maxEmployees,
    minRevenue,
    maxRevenue,
    hasWebsite,
    skipExisting,
  });

  // Export leads to CRM mutation
  const exportMutation = trpc.leadFinder.exportToCRM.useMutation({
    onSuccess: () => {
      alert('Leads exported to CRM successfully!');
      setSelectedLeads([]);
    },
  });

  // Fetch saved searches from backend
  const { data: savedSearches = [], refetch: refetchSavedSearches } = trpc.savedSearch.list.useQuery({
    searchType: 'lead_finder',
  });

  // Create saved search mutation
  const createSavedSearchMutation = trpc.savedSearch.create.useMutation({
    onSuccess: () => {
      alert('Search saved successfully!');
      refetchSavedSearches();
    },
  });

  // Delete saved search mutation
  const deleteSavedSearchMutation = trpc.savedSearch.delete.useMutation({
    onSuccess: () => {
      refetchSavedSearches();
    },
  });

  // Update last used timestamp mutation
  const updateLastUsedMutation = trpc.savedSearch.updateLastUsed.useMutation();

  const handleBusinessTypeChange = (type: BusinessType) => {
    setBusinessTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleLeadSelect = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleClearFilters = () => {
    setSkipExisting(true);
    setBusinessTypes({
      'dance-studio': false,
      'dance-school': false,
      'performing-arts': false,
      'event-venue': false,
      'k12-school': false,
    });
    setLocation('');
    setKeywords('');
    setMinEmployees('');
    setMaxEmployees('');
    setMinRevenue('');
    setMaxRevenue('');
    setHasWebsite(false);
  };

  const handleSearch = () => {
    // Search is automatic via tRPC useQuery - filters update automatically
  };

  const handleAISearch = () => {
    if (!aiSearchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    // Filter leads based on AI search query
    const query = aiSearchQuery.toLowerCase().trim();
    const filtered = leadResults.filter(lead => {
      const searchFields = [
        lead.name.toLowerCase(),
        lead.email.toLowerCase(),
        lead.location?.toLowerCase() || '',
        lead.website?.toLowerCase() || '',
        ...(lead.tags?.map(tag => tag.toLowerCase()) || [])
      ];

      return searchFields.some(field => field.includes(query));
    });

    if (filtered.length === 0) {
      alert(`No leads found matching "${aiSearchQuery}"`);
    } else {
      // Auto-select the filtered leads
      setSelectedLeads(filtered.map(lead => lead.id));
      alert(`Found ${filtered.length} leads matching "${aiSearchQuery}"\nLeads have been auto-selected.`);
    }
  };

  const handleExportCSV = (selectedOnly: boolean = false) => {
    const leadsToExport = selectedOnly
      ? leadResults.filter((lead) => selectedLeads.includes(lead.id))
      : leadResults;

    if (leadsToExport.length === 0) {
      alert('No leads to export');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Location', 'Website', 'Tags'];
    const rows = leadsToExport.map(lead => [
      lead.name,
      lead.email,
      lead.location || '',
      lead.website || '',
      lead.tags?.join('; ') || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportToCRM = (selectedOnly: boolean = false) => {
    const leadsToExport = selectedOnly
      ? leadResults.filter((lead) => selectedLeads.includes(lead.id))
      : leadResults;

    if (leadsToExport.length === 0) {
      alert('No leads selected');
      return;
    }

    exportMutation.mutate({
      leads: leadsToExport.map((lead) => ({
        name: lead.name,
        email: lead.email,
        location: lead.location,
        website: lead.website,
        tags: lead.tags,
      })),
      source: 'Apollo.io',
    });
  };

  const handleSaveCurrentSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (!name) return;

    const filters = {
      location,
      keywords,
      minEmployees,
      maxEmployees,
      minRevenue,
      maxRevenue,
      hasWebsite,
      skipExisting,
      businessTypes,
    };

    createSavedSearchMutation.mutate({
      name,
      searchType: 'lead_finder',
      filters,
      resultCount: leadResults.length,
    });
  };

  const handleLoadSavedSearch = (searchId: string) => {
    const search = savedSearches.find((s) => s.id === searchId);
    if (!search) return;

    // Update last used timestamp
    updateLastUsedMutation.mutate({ id: searchId });

    // Load filters from saved search
    const filters = search.filters as any;
    setLocation(filters.location || '');
    setKeywords(filters.keywords || '');
    setMinEmployees(filters.minEmployees || '');
    setMaxEmployees(filters.maxEmployees || '');
    setMinRevenue(filters.minRevenue || '');
    setMaxRevenue(filters.maxRevenue || '');
    setHasWebsite(filters.hasWebsite || false);
    setSkipExisting(filters.skipExisting || false);
    setBusinessTypes(filters.businessTypes || {
      'dance-studio': false,
      'dance-school': false,
      'performing-arts': false,
      'event-venue': false,
      'k12-school': false,
    });
  };

  const handleDeleteSavedSearch = (searchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved search?')) {
      deleteSavedSearchMutation.mutate({ id: searchId });
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Filters */}
      <div className="w-80 bg-slate-800/50 border-r border-slate-700/30 overflow-y-auto p-5">
        <h2 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-5 pb-3 border-b border-slate-700/30">
          🔍 Filters
        </h2>

        {/* Skip Existing */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={skipExisting}
              onChange={(e) => setSkipExisting(e.target.checked)}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className="text-sm text-slate-300">Skip already in CRM</span>
          </label>
        </div>

        {/* Business Type */}
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Business Type
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={businessTypes['dance-studio']}
                onChange={() => handleBusinessTypeChange('dance-studio')}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className="text-sm text-slate-300">Dance Studio</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={businessTypes['dance-school']}
                onChange={() => handleBusinessTypeChange('dance-school')}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className="text-sm text-slate-300">Dance School</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={businessTypes['performing-arts']}
                onChange={() => handleBusinessTypeChange('performing-arts')}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className="text-sm text-slate-300">Performing Arts Center</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={businessTypes['event-venue']}
                onChange={() => handleBusinessTypeChange('event-venue')}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className="text-sm text-slate-300">Event Venue</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={businessTypes['k12-school']}
                onChange={() => handleBusinessTypeChange('k12-school')}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className="text-sm text-slate-300">K-12 School</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Location
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or zip code..."
            className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Keywords */}
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Keywords (optional)
          </div>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. recital, performance, show"
            className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Company Size */}
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Company Size
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minEmployees}
              onChange={(e) => setMinEmployees(e.target.value)}
              placeholder="Min"
              className="px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="number"
              value={maxEmployees}
              onChange={(e) => setMaxEmployees(e.target.value)}
              placeholder="Max"
              className="px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">employees</div>
        </div>

        {/* Revenue Range */}
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Revenue Range
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minRevenue}
              onChange={(e) => setMinRevenue(e.target.value)}
              placeholder="Min"
              className="px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="number"
              value={maxRevenue}
              onChange={(e) => setMaxRevenue(e.target.value)}
              placeholder="Max"
              className="px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">USD (optional)</div>
        </div>

        {/* Has Website */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasWebsite}
              onChange={(e) => setHasWebsite(e.target.checked)}
              className="w-4 h-4 rounded accent-green-500"
            />
            <span className="text-sm text-slate-300">Has website</span>
          </label>
        </div>

        {/* Filter Actions */}
        <div className="grid grid-cols-2 gap-2 pt-5 border-t border-slate-700/30">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg text-sm font-medium hover:bg-slate-700/50 transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🔍</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Lead Finder
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Find potential clients using AI-powered search or manual filters
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {/* AI Search */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                🤖 AI Search
              </span>
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                BETA
              </span>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                placeholder="e.g. Dance studios in Ontario with 100+ students"
                className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
              <button
                onClick={handleAISearch}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/40 transition-all"
              >
                AI Search
              </button>
            </div>
          </div>

          <div className="text-center text-slate-500 text-sm my-5 relative">
            <span className="bg-gray-50 px-4 relative z-10">
              Or use manual filters on the left →
            </span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/30"></div>
            </div>
          </div>

          {/* Saved Searches */}
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Saved Searches
            </h3>
            {savedSearches.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-4">
                No saved searches yet. Save your first search below!
              </div>
            ) : (
              savedSearches.map((search) => (
                <div
                  key={search.id}
                  onClick={() => handleLoadSavedSearch(search.id)}
                  className="flex justify-between items-center px-3 py-2 bg-slate-900/60 border border-slate-700/30 rounded-lg mb-2 hover:border-green-500/50 cursor-pointer transition-all group"
                >
                  <span className="text-sm text-slate-300">{search.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
                      {search.resultCount}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSavedSearch(search.id, e)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={handleSaveCurrentSearch}
              disabled={createSavedSearchMutation.isPending}
              className="w-full mt-2 px-3 py-2 bg-slate-900/60 border border-dashed border-slate-700/50 text-green-500 rounded-lg text-sm font-medium hover:bg-slate-800/60 hover:border-green-500/50 transition-all disabled:opacity-50"
            >
              {createSavedSearchMutation.isPending ? 'Saving...' : '+ Save Current Search'}
            </button>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/30">
            <div className="text-sm text-slate-400">
              {isSearching ? (
                <span>Searching...</span>
              ) : (
                <>
                  <strong className="text-slate-100 font-semibold">{leadResults.length} results</strong> found
                  {selectedLeads.length > 0 && (
                    <span className="ml-2">({selectedLeads.length} selected)</span>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportCSV(true)}
                disabled={selectedLeads.length === 0}
                className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg text-sm font-medium hover:bg-slate-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📥 Export CSV ({selectedLeads.length})
              </button>
              <button
                onClick={() => handleExportToCRM(true)}
                disabled={selectedLeads.length === 0 || exportMutation.isPending}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportMutation.isPending ? 'Adding...' : `+ Add Selected to CRM (${selectedLeads.length})`}
              </button>
            </div>
          </div>

          {/* Lead Cards */}
          {leadResults.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 mb-4 hover:border-green-500/50 hover:bg-slate-800/70 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => handleLeadSelect(lead.id)}
                  className="mt-1 w-4 h-4 rounded accent-green-500"
                />
                <div className="flex-1">
                  <div className="text-base font-semibold text-slate-100 mb-1">{lead.name}</div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-1">
                    <span className="flex items-center gap-1">📍 {lead.location}</span>
                    <span className="flex items-center gap-1">🌐 {lead.website}</span>
                    <span className="flex items-center gap-1">📧 {lead.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">👥 {lead.employees}</span>
                    <span className="flex items-center gap-1">💰 {lead.revenue}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {lead.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-900/60 border border-slate-700/30 rounded text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert('Campaign feature coming in Phase 13')}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  Add to Campaign
                </button>
                <button
                  onClick={() => {
                    setSelectedLeads([lead.id]);
                    handleExportToCRM(true);
                  }}
                  disabled={exportMutation.isPending}
                  className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg text-sm font-medium hover:bg-slate-700/50 transition-all disabled:opacity-50"
                >
                  {exportMutation.isPending ? 'Adding...' : 'Add to CRM'}
                </button>
                <button className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg text-sm font-medium hover:bg-slate-700/50 transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}

          {/* Load More */}
          <button className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/30 text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-800/70 hover:border-green-500/50 hover:text-green-500 transition-all mt-4">
            Load More Results (124 remaining)
          </button>
        </div>
      </div>
    </div>
  );
}
