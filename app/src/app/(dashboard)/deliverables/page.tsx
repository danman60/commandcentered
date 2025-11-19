'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function DeliverablesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [isNewDeliverableModalOpen, setIsNewDeliverableModalOpen] = useState(false);

  const { data: deliverables } = trpc.deliverable.list.useQuery({
    status: statusFilter as any || undefined,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'bg-slate-600 text-slate-200';
      case 'IN_PROGRESS':
        return 'bg-blue-600 text-white';
      case 'IN_REVIEW':
        return 'bg-yellow-600 text-white';
      case 'DELIVERED':
        return 'bg-green-600 text-white';
      case 'CANCELLED':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl">🎬</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Deliverables
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Track services, editors, and delivery status
            </p>
          </div>
          <button
            onClick={() => setIsNewDeliverableModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 transition-all hover:-translate-y-0.5"
          >
            ➕ Add Deliverable
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex-shrink-0 px-8 py-4 bg-slate-900/60 border-b border-slate-700/50">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search by client, event, or editor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 min-w-[200px]"
          >
            <option value="">All Services</option>
            <option value="Full Edit">Full Edit</option>
            <option value="Highlight Reel">Highlight Reel</option>
            <option value="Awards">Awards</option>
            <option value="Group Numbers">Group Numbers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 min-w-[200px]"
          >
            <option value="">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Deliverables Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-950/80 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-cyan-400">
                  Client / Event ⇅
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-cyan-400">
                  Services ⇅
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-cyan-400">
                  Google Drive ⇅
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-cyan-400">
                  Assigned Editor ⇅
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-cyan-400">
                  Due Date ⇅
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-cyan-400">
                  Status ⇅
                </th>
              </tr>
            </thead>
            <tbody>
              {deliverables?.map((deliverable: any) => (
                <tr
                  key={deliverable.id}
                  onClick={() => setSelectedDeliverableId(deliverable.id)}
                  className="border-b border-slate-800 hover:bg-cyan-500/5 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">
                      {deliverable.event?.client?.companyName || 'N/A'}
                    </div>
                    <div className="text-sm text-slate-400">
                      {deliverable.event?.eventName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {deliverable.services?.slice(0, 3).map((service: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs rounded"
                        >
                          {service.name}
                        </span>
                      ))}
                      {deliverable.services?.length > 3 && (
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                          +{deliverable.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {deliverable.googleDriveLink ? (
                      <a
                        href={deliverable.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Open Folder
                      </a>
                    ) : (
                      <span className="text-slate-500">No link</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-200">
                      {deliverable.assignedEditor?.firstName} {deliverable.assignedEditor?.lastName || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {formatDate(deliverable.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deliverable.status)}`}>
                      {deliverable.status?.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}

              {!deliverables || deliverables.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No deliverables found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isNewDeliverableModalOpen && (
        <NewDeliverableModal
          isOpen={isNewDeliverableModalOpen}
          onClose={() => setIsNewDeliverableModalOpen(false)}
        />
      )}

      {selectedDeliverableId && (
        <DeliverableDetailModal
          deliverableId={selectedDeliverableId}
          isOpen={!!selectedDeliverableId}
          onClose={() => setSelectedDeliverableId(null)}
        />
      )}
    </div>
  );
}

// New Deliverable Modal Component
function NewDeliverableModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    eventId: '',
    deliverableType: '',
    deliverableName: '',
    assignedEditorId: '',
    dueDate: '',
  });

  const { data: events } = trpc.event.list.useQuery({});
  const { data: operators } = trpc.operator.list.useQuery({});

  const createDeliverable = trpc.deliverable.create.useMutation({
    onSuccess: () => {
      onClose();
      window.location.reload();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeliverable.mutate({
      eventId: formData.eventId,
      deliverableType: formData.deliverableType,
      deliverableName: formData.deliverableName,
      dueDate: new Date(formData.dueDate),
      assignedEditorId: formData.assignedEditorId || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-cyan-500/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create New Deliverable</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Event
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              required
            >
              <option value="">Select an event</option>
              {events?.map((event: any) => (
                <option key={event.id} value={event.id}>
                  {event.eventName} - {event.client?.companyName || 'No client'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Deliverable Type
            </label>
            <select
              value={formData.deliverableType}
              onChange={(e) => setFormData({ ...formData, deliverableType: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              required
            >
              <option value="">Select type</option>
              <option value="FULL_EDIT">Full Edit</option>
              <option value="HIGHLIGHT_REEL">Highlight Reel</option>
              <option value="AWARDS">Awards</option>
              <option value="GROUP_NUMBERS">Group Numbers</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Deliverable Name
            </label>
            <input
              type="text"
              value={formData.deliverableName}
              onChange={(e) => setFormData({ ...formData, deliverableName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g., Elite Dance Competition Full Edit"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Assigned Editor
            </label>
            <select
              value={formData.assignedEditorId}
              onChange={(e) => setFormData({ ...formData, assignedEditorId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">Unassigned</option>
              {operators?.map((operator: any) => (
                <option key={operator.id} value={operator.id}>
                  {operator.firstName} {operator.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createDeliverable.isPending}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {createDeliverable.isPending ? 'Creating...' : 'Create Deliverable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Deliverable Detail Modal Component
function DeliverableDetailModal({ deliverableId, isOpen, onClose }: { deliverableId: string; isOpen: boolean; onClose: () => void }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    assignedEditorId: '',
    dueDate: '',
    status: '',
  });

  const { data: deliverable } = trpc.deliverable.getById.useQuery({ id: deliverableId });
  const { data: operators } = trpc.operator.list.useQuery({});

  const updateDeliverable = trpc.deliverable.update.useMutation({
    onSuccess: () => {
      setIsEditMode(false);
      window.location.reload();
    },
  });

  const handleEdit = () => {
    setFormData({
      assignedEditorId: deliverable?.assignedEditorId || '',
      dueDate: deliverable?.dueDate ? new Date(deliverable.dueDate).toISOString().split('T')[0] : '',
      status: deliverable?.status || '',
    });
    setIsEditMode(true);
  };

  const handleSave = () => {
    updateDeliverable.mutate({
      id: deliverableId,
      assignedEditorId: formData.assignedEditorId || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    });
  };

  if (!isOpen || !deliverable) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-xl w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-cyan-500/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Deliverable Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Event Info */}
          <div className="mb-6 p-4 bg-slate-800/60 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Event</div>
            <div className="font-bold text-white">
              {deliverable.event?.eventName || 'N/A'}
            </div>
            <div className="text-sm text-slate-400">
              {deliverable.event?.venueName || 'No venue'}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Assigned Editor
              </label>
              {isEditMode ? (
                <select
                  value={formData.assignedEditorId}
                  onChange={(e) => setFormData({ ...formData, assignedEditorId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Unassigned</option>
                  {operators?.map((operator: any) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.firstName} {operator.lastName}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-2 bg-slate-800/40 rounded-lg text-white">
                  {deliverable.assignedEditor?.name || 'Unassigned'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Due Date
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-800/40 rounded-lg text-white">
                  {deliverable.dueDate ? new Date(deliverable.dueDate).toLocaleDateString() : 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Status
              </label>
              {isEditMode ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              ) : (
                <div className="px-4 py-2 bg-slate-800/40 rounded-lg">
                  <span className="text-white">{deliverable.status?.replace('_', ' ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assets List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Assets</h3>
            <div className="space-y-2">
              {deliverable?.assets?.map((asset: any) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-200">{asset.assetName}</div>
                    {asset.assetType && (
                      <div className="text-xs text-slate-400 mt-1">{asset.assetType}</div>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-xs rounded ${asset.completed ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'}`}>
                    {asset.completed ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              ))}
              {!deliverable?.assets || deliverable.assets.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">
                  No assets added yet
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateDeliverable.isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {updateDeliverable.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all"
              >
                Edit Deliverable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
