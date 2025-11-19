import React from 'react';
import type { Lead, LeadProduct } from '@prisma/client';
import { TemperatureBadge } from './TemperatureBadge';
import { ContactInfo } from './ContactInfo';
import { ProductCard } from './ProductCard';

interface ClientCardProps {
  lead: Lead & { leadProducts: LeadProduct[] };
  onLogContact?: () => void;
  onSendEmail?: () => void;
  onViewDetails?: () => void;
  onProductUpdate?: () => void;
  searchQuery?: string;
}

export function ClientCard({
  lead,
  onLogContact,
  onSendEmail,
  onViewDetails,
  onProductUpdate,
  searchQuery,
}: ClientCardProps) {
  // Check if follow-up is overdue
  const isOverdue = lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date();

  // Calculate lead age
  const getLeadAge = () => {
    const createdDate = new Date(lead.createdAt);
    const now = new Date();
    const daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysOld === 0) return { text: 'New today', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (daysOld === 1) return { text: '1 day old', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (daysOld < 7) return { text: `${daysOld} days old`, color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (daysOld < 30) return { text: `${Math.floor(daysOld / 7)} weeks old`, color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (daysOld < 90) return { text: `${Math.floor(daysOld / 30)} months old`, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { text: `${Math.floor(daysOld / 30)} months old`, color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  const leadAge = getLeadAge();

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!searchQuery || !text) return text;

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-gray-100">
              {highlightMatch(lead.organization || 'Unnamed Organization')}
            </h3>
            {isOverdue && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30 font-semibold animate-pulse">
                ⚠️ OVERDUE
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs rounded border font-medium ${leadAge.color}`}>
              {leadAge.text}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            {lead.email && (
              <span className="flex items-center gap-1">
                📧 {highlightMatch(lead.email)}
              </span>
            )}
            {lead.phone && (
              <span className="flex items-center gap-1">
                📱 {lead.phone}
              </span>
            )}
          </div>
        </div>
        <TemperatureBadge temperature={lead.temperature as any} />
      </div>

      {/* Contact Info */}
      <div className="mb-5">
        <ContactInfo
          lastContactedAt={lead.lastContactedAt}
          nextFollowUpAt={lead.nextFollowUpAt}
          contactFrequency={lead.contactFrequency}
        />
      </div>

      {/* Product Focus Section */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-gray-300 font-medium mb-3">
          <span className="text-xl">📦</span>
          <span>Product Focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lead.leadProducts.map((product) => (
            <ProductCard
              key={product.id}
              leadId={lead.id}
              productName={product.productName}
              status={product.status}
              isInterested={product.isInterested}
              revenueAmount={product.revenueAmount ? Number(product.revenueAmount) : null}
              projectedRevenue={
                product.projectedRevenue ? Number(product.projectedRevenue) : null
              }
              notes={product.notes}
              onUpdate={onProductUpdate}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLogContact?.();
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          📝 Log Contact
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSendEmail?.();
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          📧 Send Email
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.();
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          👁️ View Details
        </button>
      </div>
    </div>
  );
}
