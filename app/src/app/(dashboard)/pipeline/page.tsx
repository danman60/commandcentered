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

export default function PipelinePage() {
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState<string>('');

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Pipeline</h1>
          <p className="text-gray-400 mt-1">Manage leads and track opportunities</p>
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

      {/* Pipeline Columns */}
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

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    status: '' as LeadStatus | 'PROPOSAL_VIEWED' | 'PROPOSAL_SUBMITTED' | 'CONTRACT_SENT' | 'LOST',
  });

  // Update form when lead loads
  if (lead && formData.organization === '') {
    setFormData({
      organization: lead.organization || '',
      contactName: lead.contactName || '',
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status as any,
    });
  }

  const handleSave = () => {
    updateLead.mutate({ id: leadId, ...formData });
    setIsEditing(false);
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
        {lead.leadProducts && lead.leadProducts.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Products</h3>
            <div className="space-y-2">
              {lead.leadProducts.map((product) => (
                <div
                  key={product.productName}
                  className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{product.productName}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getProductStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                  {product.revenueAmount && (
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${product.revenueAmount.toLocaleString()}
                    </p>
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
