import React, { useState } from 'react';
import type { ProductStatus } from '@prisma/client';
import { trpc } from '@/lib/trpc/client';
import { Pencil, Check, X } from 'lucide-react';

interface ProductCardProps {
  leadId?: string;
  productName: string;
  status: ProductStatus;
  isInterested: boolean;
  revenueAmount: number | null;
  projectedRevenue: number | null;
  notes: string | null;
  statusDetails?: string;
  onUpdate?: () => void;
}

const STATUS_LABELS: Record<ProductStatus, string> = {
  WON: 'Won',
  LOST: 'Lost',
  NOT_INTERESTED: 'Not Interested',
  PROPOSAL: 'Proposal Sent',
  DISCUSSING: 'Discussing',
  NOT_APPLICABLE: 'Not Applicable',
};

const STATUS_STYLES: Record<ProductStatus, string> = {
  WON: 'bg-green-500/20 text-green-400 border-green-500/30',
  LOST: 'bg-red-500/20 text-red-400 border-red-500/30',
  NOT_INTERESTED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  PROPOSAL: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DISCUSSING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  NOT_APPLICABLE: 'bg-gray-600/20 text-gray-500 border-gray-600/30',
};

export function ProductCard({
  leadId,
  productName,
  status,
  isInterested,
  revenueAmount,
  projectedRevenue,
  notes,
  statusDetails,
  onUpdate,
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status,
    revenueAmount: revenueAmount?.toString() || '',
    projectedRevenue: projectedRevenue?.toString() || '',
    notes: notes || '',
  });

  const updateProduct = trpc.lead.updateProduct.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      onUpdate?.();
    },
  });

  const handleSave = () => {
    if (!leadId) return;

    updateProduct.mutate({
      leadId,
      productName,
      status: formData.status,
      isInterested,
      revenueAmount: formData.revenueAmount ? parseFloat(formData.revenueAmount) : undefined,
      projectedRevenue: formData.projectedRevenue ? parseFloat(formData.projectedRevenue) : undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleCancel = () => {
    setFormData({
      status,
      revenueAmount: revenueAmount?.toString() || '',
      projectedRevenue: projectedRevenue?.toString() || '',
      notes: notes || '',
    });
    setIsEditing(false);
  };

  const revenue = revenueAmount || projectedRevenue || 0;
  const isProjected = !revenueAmount && projectedRevenue;

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 relative group">
      {/* Quick Edit Button (only show if leadId provided) */}
      {leadId && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 p-1.5 bg-slate-700/50 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Quick edit"
        >
          <Pencil className="w-3 h-3 text-gray-400" />
        </button>
      )}

      {/* Product Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isInterested && status !== 'NOT_INTERESTED' && status !== 'LOST' && (
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <span className="text-green-400 text-xs">✓</span>
            </div>
          )}
          <div className="font-medium text-gray-200">{productName}</div>
        </div>

        {/* Status Badge or Dropdown */}
        {isEditing ? (
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
            className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="DISCUSSING">Discussing</option>
            <option value="PROPOSAL">Proposal Sent</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
            <option value="NOT_INTERESTED">Not Interested</option>
            <option value="NOT_APPLICABLE">Not Applicable</option>
          </select>
        ) : (
          <span
            className={`px-2 py-1 rounded text-xs font-medium border ${STATUS_STYLES[status]}`}
          >
            {STATUS_LABELS[status]}
          </span>
        )}
      </div>

      {/* Status and Revenue */}
      {isEditing ? (
        <div className="space-y-2 text-sm mb-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Actual Revenue</label>
            <input
              type="number"
              value={formData.revenueAmount}
              onChange={(e) => setFormData({ ...formData, revenueAmount: e.target.value })}
              placeholder="0.00"
              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Projected Revenue</label>
            <input
              type="number"
              value={formData.projectedRevenue}
              onChange={(e) => setFormData({ ...formData, projectedRevenue: e.target.value })}
              placeholder="0.00"
              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Add notes..."
              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1 text-sm mb-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-400 font-medium">Status:</span>
            <span className="text-gray-300">{statusDetails || STATUS_LABELS[status]}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400 font-medium">Revenue:</span>
            <span className="text-gray-300">
              ${revenue.toLocaleString()}
              {isProjected && <span className="text-gray-500"> (projected)</span>}
            </span>
          </div>
        </div>
      )}

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleSave}
            disabled={updateProduct.isPending}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Check className="w-3 h-3" />
            {updateProduct.isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded text-xs font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      )}

      {/* Notes (read-only view) */}
      {!isEditing && notes && (
        <div className="text-sm text-gray-400 italic border-t border-gray-700 pt-2">
          {notes}
        </div>
      )}
    </div>
  );
}
