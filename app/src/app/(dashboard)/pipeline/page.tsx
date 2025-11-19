'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { trpc } from '@/lib/trpc/client';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Fetch leads
  const { data: leads, refetch: refetchLeads } = trpc.lead.list.useQuery({
    search: searchQuery || undefined,
    productName: productFilter || undefined,
  });

  // Get leads by status
  const getLeadsByStatus = (status: LeadStatus) => {
    return leads?.filter(lead => lead.status === status) ?? [];
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 -mx-8 px-8 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Pipeline</h1>
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
                <Columns className="w-4 h-4" />
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
                <LayoutGrid className="w-4 h-4" />
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
                <TableIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Table</span>
              </button>
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
        </div>
      </Card>

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
                        {lead.organization}
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">{lead.contactName}</p>

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
                    <p className="text-gray-500 text-sm text-center py-8">No leads in this stage</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {leads?.map((lead) => (
            <Card
              key={lead.id}
              padding="medium"
              hover="lift"
              className="cursor-pointer"
              onClick={() => setSelectedLeadId(lead.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">{lead.organization}</h3>
                  <p className="text-sm text-gray-400">{lead.contactName}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    PIPELINE_STAGES.find(s => s.id === lead.status)?.color || 'bg-gray-600'
                  } bg-opacity-20 ${
                    PIPELINE_STAGES.find(s => s.id === lead.status)?.color.replace('bg-', 'text-') || 'text-gray-400'
                  }`}
                >
                  {PIPELINE_STAGES.find(s => s.id === lead.status)?.label}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {lead.email && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{lead.phone}</span>
                  </div>
                )}
              </div>

              {lead.leadProducts && lead.leadProducts.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-700">
                  {lead.leadProducts.map((product) => (
                    <span
                      key={product.productName}
                      className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded"
                    >
                      {product.productName}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
          {(!leads || leads.length === 0) && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No leads found. Click "New Lead" to get started.
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
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      No leads found. Click "New Lead" to get started.
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
