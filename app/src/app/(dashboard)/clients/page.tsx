'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { formatDistanceToNow } from 'date-fns';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | 'BLACKLISTED' | ''>('');
  const [industryFilter, setIndustryFilter] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: clients, refetch } = trpc.client.list.useQuery({
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    industry: industryFilter || undefined,
  });

  const { data: industries } = trpc.client.getIndustries.useQuery();

  const handleViewDetails = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleCloseDetailModal = () => {
    setSelectedClientId(null);
    refetch();
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    refetch();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl">🏢</span>
              <h1 className="text-3xl font-bold tactical-heading">Clients</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Manage your client relationships and track engagement
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5"
          >
            ➕ Add Client
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex-shrink-0 px-8 py-4 bg-slate-900/60 border-b border-slate-700/50">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 min-w-[200px]"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>

          {/* Industry Filter */}
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 min-w-[200px]"
          >
            <option value="">All Industries</option>
            {industries?.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-950/80 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Organization
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Industry
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Total Events
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Total Revenue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Last Contacted
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Google Drive
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
            {clients?.map((client) => {
              const clientWithEvents = client as typeof client & {
                events: Array<{ id: string; revenueAmount: number | null }>;
              };
              const totalRevenue = clientWithEvents.events?.reduce(
                (sum, event) => sum + Number(event.revenueAmount || 0),
                0
              ) || 0;

              return (
                <tr
                  key={client.id}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(client.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{client.organization}</div>
                    <div className="text-sm text-slate-400">{client.contactName || 'No contact'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded ${
                        client.status === 'ACTIVE'
                          ? 'bg-green-600 text-white'
                          : client.status === 'INACTIVE'
                          ? 'bg-slate-600 text-slate-200'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {client.industry || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {clientWithEvents.events?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    ${totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {client.googleDriveFolderUrl ? (
                      <a
                        href={client.googleDriveFolderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 View
                      </a>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(client.id);
                      }}
                      className="text-green-400 hover:text-green-300 font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!clients || clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No clients found</p>
          </div>
        ) : null}
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && <AddClientModal onClose={handleCloseAddModal} />}

      {/* Client Detail Modal */}
      {selectedClientId && (
        <ClientDetailModal clientId={selectedClientId} onClose={handleCloseDetailModal} />
      )}
    </div>
  );
}

// Add Client Modal Component
function AddClientModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    industry: '',
    size: '',
    googleDriveFolderUrl: '',
    notes: '',
  });

  const createClient = trpc.client.create.useMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClient.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Province/State
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Company Size
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="e.g., 1-10, 11-50, 51-200"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Google Drive Folder URL
                </label>
                <input
                  type="url"
                  value={formData.googleDriveFolderUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, googleDriveFolderUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Any additional notes about this client..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClient.isPending}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {createClient.isPending ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Client Detail Modal Component
function ClientDetailModal({ clientId, onClose }: { clientId: string; onClose: () => void }) {
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { data: client, refetch } = trpc.client.getById.useQuery({ id: clientId });

  const updateClient = trpc.client.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const updateNotes = trpc.client.update.useMutation({
    onSuccess: () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => {
      setSaveStatus('idle');
    },
  });

  // Initialize notes when client data loads
  if (client && notes === '' && client.notes) {
    setNotes(client.notes);
  }

  // Autosave notes
  const handleNotesChange = (value: string) => {
    setNotes(value);
    setSaveStatus('saving');

    // Debounced save
    const timeoutId = setTimeout(() => {
      updateNotes.mutate({
        id: clientId,
        notes: value || undefined,
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  if (!client) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    );
  }

  const clientWithRelations = client as typeof client & {
    events: Array<{
      id: string;
      eventName: string;
      loadInTime: Date;
      revenueAmount: number | null;
      shifts: Array<{ id: string }>;
    }>;
    deliverables: Array<{
      id: string;
      deliverableType: string;
      status: string;
      dueDate: Date | null;
      event: { id: string; eventName: string } | null;
    }>;
    communicationTouchpoints: Array<{
      id: string;
      touchpointType: string;
      notes: string | null;
      createdAt: Date;
    }>;
  };

  const totalRevenue = clientWithRelations.events?.reduce(
    (sum, event) => sum + Number(event.revenueAmount || 0),
    0
  ) || 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
        style={{ width: '60vw', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{client.organization}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="p-6">
            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-slate-800 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-slate-400">Contact Name</p>
                  <p className="text-white font-medium">{client.contactName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white font-medium">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="text-white font-medium">{client.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Website</p>
                  {client.website ? (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-medium"
                    >
                      Visit Website
                    </a>
                  ) : (
                    <p className="text-white font-medium">N/A</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-400">Address</p>
                  <p className="text-white font-medium">
                    {[
                      client.addressLine1,
                      client.addressLine2,
                      client.city,
                      client.province,
                      client.postalCode,
                      client.country,
                    ]
                      .filter(Boolean)
                      .join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Key Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-4 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">Total Events</p>
                  <p className="text-2xl font-bold text-white">{clientWithRelations.events?.length || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-4 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-4 rounded-lg">
                  <p className="text-sm text-purple-400 font-medium">Deliverables</p>
                  <p className="text-2xl font-bold text-white">{clientWithRelations.deliverables?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Linked Events */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Linked Events ({clientWithRelations.events?.length || 0})
              </h3>
              {clientWithRelations.events && clientWithRelations.events.length > 0 ? (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Event Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Revenue</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Shifts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientWithRelations.events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{event.eventName}</td>
                          <td className="px-4 py-2 text-sm text-slate-400">
                            {new Date(event.loadInTime).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            ${Number(event.revenueAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-400">{event.shifts?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No events yet</p>
              )}
            </div>

            {/* Linked Deliverables */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Linked Deliverables ({clientWithRelations.deliverables?.length || 0})
              </h3>
              {clientWithRelations.deliverables && clientWithRelations.deliverables.length > 0 ? (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Event</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Due Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientWithRelations.deliverables.map((deliverable) => (
                        <tr key={deliverable.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{deliverable.deliverableType}</td>
                          <td className="px-4 py-2 text-sm text-slate-400">
                            {deliverable.event?.eventName || 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-400">
                            {deliverable.dueDate
                              ? new Date(deliverable.dueDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                deliverable.status === 'DELIVERED'
                                  ? 'bg-green-100 text-green-800'
                                  : deliverable.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800'
                                  : deliverable.status === 'IN_REVIEW'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {deliverable.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No deliverables yet</p>
              )}
            </div>

            {/* Communication History */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Communication History ({clientWithRelations.communicationTouchpoints?.length || 0})
              </h3>
              {clientWithRelations.communicationTouchpoints && clientWithRelations.communicationTouchpoints.length > 0 ? (
                <div className="space-y-3">
                  {clientWithRelations.communicationTouchpoints.map((touchpoint) => (
                    <div key={touchpoint.id} className="bg-slate-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-900">{touchpoint.touchpointType.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(touchpoint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {touchpoint.notes && <p className="text-sm text-slate-400">{touchpoint.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No communication history yet</p>
              )}
            </div>

            {/* Google Drive */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Google Drive</h3>
              <div className="bg-slate-800 p-4 rounded-lg">
                {client.googleDriveFolderUrl ? (
                  <a
                    href={client.googleDriveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.5 2.5l7.5 13h-15z" />
                      <path d="M12.5 21.5l-7.5-13h15z" />
                    </svg>
                    Open Client Folder
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">No Drive folder linked</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                {saveStatus === 'saving' && (
                  <span className="text-sm text-gray-500">Saving...</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-sm text-green-400">✓ Saved</span>
                )}
              </div>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 resize-none"
                placeholder="Add notes about this client..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
