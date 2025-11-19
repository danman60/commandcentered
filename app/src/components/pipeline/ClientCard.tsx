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
        <div>
          <h3 className="text-xl font-semibold text-gray-100 mb-1">
            {highlightMatch(lead.organization || 'Unnamed Organization')}
          </h3>
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
