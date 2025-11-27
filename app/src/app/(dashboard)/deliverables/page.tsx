'use client';

import { trpc } from '@/lib/trpc/client';
import { useState, useMemo, useEffect } from 'react';
import { SortableTableHeader, useSorting } from '@/components/ui/SortableTableHeader';
import { InlineEditField, InlineEditSelect } from '@/components/ui/InlineEditField';

export default function DeliverablesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [isNewDeliverableModalOpen, setIsNewDeliverableModalOpen] = useState(false);

  const { data: deliverables, refetch: refetchDeliverables } = trpc.deliverable.list.useQuery({
    status: statusFilter as any || undefined,
  });

  const updateDeliverable = trpc.deliverable.update.useMutation({
    onSuccess: () => {
      refetchDeliverables();
    },
  });

  const updateStatus = trpc.deliverable.updateStatus.useMutation({
    onSuccess: () => {
      refetchDeliverables();
    },
  });

  // Sorting hook - sort by due date by default
  const { sortConfig, handleSort, sortedData } = useSorting(
    deliverables || [],
    'dueDate',
    'asc'
  );

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-600 text-white animate-pulse';
      case 'URGENT':
        return 'bg-red-500 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'NORMAL':
        return 'bg-green-600 text-white';
      case 'LOW':
        return 'bg-slate-600 text-slate-200';
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
      <div className="flex-shrink-0 bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl">🎬</span>
              <h1 className="text-3xl font-bold tactical-heading">
                Deliverables
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Track services, editors, and delivery status
            </p>
          </div>
          <button
            onClick={() => setIsNewDeliverableModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5"
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
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 min-w-[200px]"
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
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 min-w-[200px]"
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
                <SortableTableHeader
                  label="Client"
                  sortKey="client.organization"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Event"
                  sortKey="event.eventName"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Services
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Google Drive
                </th>
                <SortableTableHeader
                  label="Assigned Editor"
                  sortKey="assignedEditor.firstName"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Assets"
                  sortKey="completedAssets"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Due Date"
                  sortKey="dueDate"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Priority"
                  sortKey="priority"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Completion %"
                  sortKey="completionPercentage"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
              </tr>
            </thead>
            <tbody>
              {sortedData?.map((deliverable: any) => (
                <tr
                  key={deliverable.id}
                  onClick={() => setSelectedDeliverableId(deliverable.id)}
                  className="border-b border-slate-800 hover:bg-green-500/5 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">
                      {deliverable.client?.organization || deliverable.client?.contactName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-400">
                      {deliverable.event?.eventName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {deliverable.services?.slice(0, 3).map((service: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-xs rounded"
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
                    {deliverable.googleDriveFolderUrl ? (
                      <a
                        href={deliverable.googleDriveFolderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-green-400 hover:text-green-300"
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">{deliverable.completedAssets || 0}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-300">{deliverable.totalAssets || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <InlineEditField
                      type="date"
                      value={deliverable.dueDate ? new Date(deliverable.dueDate).toISOString().split('T')[0] : ''}
                      onSave={async (newValue: string) => {
                        await updateDeliverable.mutateAsync({
                          id: deliverable.id,
                          dueDate: new Date(newValue),
                        });
                      }}
                      formatDisplay={(val) => formatDate(val)}
                      className="text-slate-300"
                    />
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(deliverable.priority || 'NORMAL')}`}>
                      <InlineEditSelect
                        value={deliverable.priority || 'NORMAL'}
                        options={[
                          { label: 'Low', value: 'LOW' },
                          { label: 'Normal', value: 'NORMAL' },
                          { label: 'High', value: 'HIGH' },
                          { label: 'Urgent', value: 'URGENT' },
                          { label: 'Critical', value: 'CRITICAL' },
                        ]}
                        onSave={async (newValue: string) => {
                          await updateDeliverable.mutateAsync({
                            id: deliverable.id,
                            priority: newValue as any,
                          });
                        }}
                        displayClassName="text-xs"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deliverable.status)}`}>
                      <InlineEditSelect
                        value={deliverable.status}
                        options={[
                          { label: 'Not Started', value: 'NOT_STARTED' },
                          { label: 'In Progress', value: 'IN_PROGRESS' },
                          { label: 'In Review', value: 'IN_REVIEW' },
                          { label: 'Delivered', value: 'DELIVERED' },
                          { label: 'Cancelled', value: 'CANCELLED' },
                        ]}
                        onSave={async (newValue: string) => {
                          await updateStatus.mutateAsync({
                            id: deliverable.id,
                            status: newValue as any,
                          });
                        }}
                        formatDisplay={(val) => val.replace('_', ' ')}
                        displayClassName="text-xs"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <CompletionSlider
                      deliverableId={deliverable.id}
                      initialValue={deliverable.completionPercentage || 0}
                    />
                  </td>
                </tr>
              ))}

              {!deliverables || deliverables.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
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
  const [linkType, setLinkType] = useState<'event' | 'client'>('event');
  const [formData, setFormData] = useState({
    eventId: '',
    clientId: '',
    deliverableType: '',
    deliverableName: '',
    assignedEditorId: '',
    dueDate: '',
  });

  const { data: events } = trpc.event.list.useQuery({});
  const { data: clients } = trpc.client.list.useQuery({});
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
      eventId: linkType === 'event' ? formData.eventId : undefined,
      clientId: linkType === 'client' ? formData.clientId : undefined,
      // Note: If eventId is provided, clientId will be auto-populated from event.clientId on the server
      deliverableType: formData.deliverableType,
      deliverableName: formData.deliverableName,
      dueDate: new Date(formData.dueDate),
      assignedEditorId: formData.assignedEditorId || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border-2 border-green-500/30 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create New Deliverable</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Link Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Link To
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setLinkType('event');
                  setFormData({ ...formData, clientId: '' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  linkType === 'event'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Event
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinkType('client');
                  setFormData({ ...formData, eventId: '' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  linkType === 'client'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Client
              </button>
            </div>
          </div>

          {/* Event Dropdown (shown when linkType is 'event') */}
          {linkType === 'event' && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Event
              </label>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
          )}

          {/* Client Dropdown (shown when linkType is 'client') */}
          {linkType === 'client' && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Client
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                required
              >
                <option value="">Select a client</option>
                {clients?.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.organization || client.contactName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Deliverable Type
            </label>
            <select
              value={formData.deliverableType}
              onChange={(e) => setFormData({ ...formData, deliverableType: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {createDeliverable.isPending ? 'Creating...' : 'Create Deliverable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Completion Slider Component
function CompletionSlider({ deliverableId, initialValue }: { deliverableId: string; initialValue: number }) {
  const [value, setValue] = useState(initialValue);
  const updateDeliverable = trpc.deliverable.update.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);

    // Update database - if slider hits 100%, mark as DELIVERED
    updateDeliverable.mutate({
      id: deliverableId,
      completionPercentage: newValue,
      ...(newValue === 100 && { status: 'DELIVERED' }),
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'text-green-400';
    if (percentage >= 75) return 'text-lime-400';
    if (percentage >= 50) return 'text-yellow-400';
    if (percentage >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center gap-3 min-w-[180px]">
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={handleChange}
        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        style={{
          background: `linear-gradient(to right, rgb(34, 197, 94) 0%, rgb(34, 197, 94) ${value}%, rgb(51, 65, 85) ${value}%, rgb(51, 65, 85) 100%)`
        }}
      />
      <span className={`text-sm font-bold min-w-[45px] text-right ${getProgressColor(value)}`}>
        {value}%
      </span>
    </div>
  );
}

// Deliverable Detail Modal Component
function DeliverableDetailModal({ deliverableId, isOpen, onClose }: { deliverableId: string; isOpen: boolean; onClose: () => void }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGoogleDriveEditMode, setIsGoogleDriveEditMode] = useState(false);
  const [formData, setFormData] = useState({
    assignedEditorId: '',
    dueDate: '',
    status: '',
  });
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');

  const { data: deliverable } = trpc.deliverable.getById.useQuery({ id: deliverableId });
  const { data: operators } = trpc.operator.list.useQuery({});

  const updateDeliverable = trpc.deliverable.update.useMutation({
    onSuccess: () => {
      setIsEditMode(false);
    },
  });

  const updateNotes = trpc.deliverable.update.useMutation({
    onSuccess: () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => {
      setSaveStatus('idle');
    },
  });

  // Initialize notes when deliverable loads
  useEffect(() => {
    if (deliverable?.notes !== undefined) {
      setNotes(deliverable.notes || '');
    }
  }, [deliverable?.id]); // Only reset when deliverable ID changes

  // Autosave notes with debounce
  useEffect(() => {
    if (!deliverable) return;

    // Don't save if notes haven't changed from database value
    if (notes === (deliverable.notes || '')) return;

    setSaveStatus('saving');
    const timeoutId = setTimeout(() => {
      updateNotes.mutate({
        id: deliverableId,
        notes: notes || null,
      });
    }, 1000); // Save 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [notes, deliverableId]); // Only depend on notes and ID, not deliverable object

  const updateGoogleDriveFolder = trpc.deliverable.updateGoogleDriveFolder.useMutation({
    onSuccess: () => {
      setIsGoogleDriveEditMode(false);
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

  const handleGoogleDriveEdit = () => {
    setGoogleDriveUrl(deliverable?.googleDriveFolderUrl || '');
    setIsGoogleDriveEditMode(true);
  };

  const handleGoogleDriveSave = () => {
    if (!googleDriveUrl.trim()) {
      alert('Please enter a valid Google Drive folder URL');
      return;
    }

    // Extract folder ID from URL if it's a full URL
    let folderId = '';
    try {
      const url = new URL(googleDriveUrl);
      const pathParts = url.pathname.split('/');
      const folderIndex = pathParts.indexOf('folders');
      if (folderIndex !== -1 && pathParts.length > folderIndex + 1) {
        folderId = pathParts[folderIndex + 1];
      }
    } catch {
      // If not a valid URL, assume it's just the folder ID
      folderId = googleDriveUrl.trim();
    }

    updateGoogleDriveFolder.mutate({
      id: deliverableId,
      googleDriveFolderId: folderId,
      googleDriveFolderUrl: googleDriveUrl.trim(),
    });
  };

  if (!isOpen || !deliverable) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-green-500/30 rounded-xl w-[60vw] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Deliverable Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Client & Event Info */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Client Info (always present) */}
            <div className="p-4 bg-slate-800/60 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Client</div>
              <div className="font-bold text-white">
                {(deliverable as any).client?.organization || (deliverable as any).client?.contactName || 'N/A'}
              </div>
              <div className="text-sm text-slate-400">
                {(deliverable as any).client?.email || 'No contact info'}
              </div>
            </div>

            {/* Event Info (optional) */}
            <div className="p-4 bg-slate-800/60 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Event</div>
              <div className="font-bold text-white">
                {(deliverable as any).event?.eventName || 'N/A'}
              </div>
              <div className="text-sm text-slate-400">
                {(deliverable as any).event?.venueName || 'No event linked'}
              </div>
            </div>
          </div>

          {/* Editable Fields - 2 Column Layout */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Assigned Editor
              </label>
              {isEditMode ? (
                <select
                  value={formData.assignedEditorId}
                  onChange={(e) => setFormData({ ...formData, assignedEditorId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
                  {(deliverable as any).assignedEditor?.name || 'Unassigned'}
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
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-800/40 rounded-lg text-white">
                  {deliverable.dueDate ? new Date(deliverable.dueDate).toLocaleDateString() : 'Not set'}
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Status
              </label>
              {isEditMode ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
              {(deliverable as any)?.assets?.map((asset: any) => (
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
              {!(deliverable as any)?.assets || (deliverable as any).assets.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">
                  No assets added yet
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">Notes</h3>
              {saveStatus === 'saving' && (
                <span className="text-sm text-yellow-400">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-sm text-green-400">✓ Saved</span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Drop notes here... links, feedback, requirements, or anything else related to this deliverable"
              className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-vertical font-mono text-sm"
            />
            <div className="text-xs text-slate-500 mt-2">
              Notes autosave 1 second after you stop typing
            </div>
          </div>

          {/* Google Drive Folder */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Google Drive Folder</h3>
            {isGoogleDriveEditMode ? (
              <div className="space-y-3">
                <input
                  type="url"
                  value={googleDriveUrl}
                  onChange={(e) => setGoogleDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsGoogleDriveEditMode(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGoogleDriveSave}
                    disabled={updateGoogleDriveFolder.isPending}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    {updateGoogleDriveFolder.isPending ? 'Saving...' : 'Save Folder'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {deliverable?.googleDriveFolderUrl ? (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📁</span>
                      <div>
                        <div className="text-sm font-semibold text-green-300">Google Drive Folder</div>
                        <div className="text-xs text-slate-400 mt-1">Click to open folder</div>
                      </div>
                    </div>
                    <a
                      href={deliverable.googleDriveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Open Folder →
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-6 bg-slate-800/40 border border-slate-700 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📁</div>
                      <div className="text-sm text-slate-400">No Google Drive folder linked yet</div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleGoogleDriveEdit}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                >
                  {deliverable?.googleDriveFolderUrl ? 'Update Folder Link' : 'Add Folder Link'}
                </button>
              </div>
            )}
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {updateDeliverable.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
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
