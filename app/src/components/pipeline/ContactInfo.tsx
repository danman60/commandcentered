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
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs text-gray-400 uppercase mb-1">Last Contacted</div>
        <div className="text-sm text-gray-200">
          {lastContactedAt ? format(lastContactedAt, 'MMM d, yyyy') : 'Never'}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs text-gray-400 uppercase mb-1">Next Follow-Up</div>
        <div className="text-sm text-gray-200">
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
