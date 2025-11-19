import React from 'react';
import type { ProductStatus } from '@prisma/client';

interface ProductCardProps {
  productName: string;
  status: ProductStatus;
  isInterested: boolean;
  revenueAmount: number | null;
  projectedRevenue: number | null;
  notes: string | null;
  statusDetails?: string;
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
  productName,
  status,
  isInterested,
  revenueAmount,
  projectedRevenue,
  notes,
  statusDetails,
}: ProductCardProps) {
  const revenue = revenueAmount || projectedRevenue || 0;
  const isProjected = !revenueAmount && projectedRevenue;

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
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
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Status and Revenue */}
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

      {/* Notes */}
      {notes && (
        <div className="text-sm text-gray-400 italic border-t border-gray-700 pt-2">
          {notes}
        </div>
      )}
    </div>
  );
}
