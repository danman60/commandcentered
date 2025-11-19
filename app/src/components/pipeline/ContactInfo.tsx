import React from 'react';
import { format } from 'date-fns';

interface ContactInfoProps {
  lastContactedAt: Date | null;
  nextFollowUpAt: Date | null;
  contactFrequency: string | null;
}

export function ContactInfo({
  lastContactedAt,
  nextFollowUpAt,
  contactFrequency,
}: ContactInfoProps) {
  // Check if follow-up is overdue
  const isOverdue = nextFollowUpAt && new Date(nextFollowUpAt) < new Date();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs text-gray-400 uppercase mb-1">Last Contacted</div>
        <div className="text-sm text-gray-200">
          {lastContactedAt ? format(lastContactedAt, 'MMM d, yyyy') : 'Never'}
        </div>
      </div>

      <div className={`rounded-lg p-3 border ${
        isOverdue
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-gray-800/50 border-gray-700'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-400 uppercase">Next Follow-Up</div>
          {isOverdue && (
            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30 font-semibold">
              OVERDUE
            </span>
          )}
        </div>
        <div className={`text-sm ${isOverdue ? 'text-red-400 font-semibold' : 'text-gray-200'}`}>
          {nextFollowUpAt ? format(nextFollowUpAt, 'MMM d, yyyy') : 'Not set'}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs text-gray-400 uppercase mb-1">Contact Frequency</div>
        <div className="text-sm text-gray-200">{contactFrequency || 'Not set'}</div>
      </div>
    </div>
  );
}
