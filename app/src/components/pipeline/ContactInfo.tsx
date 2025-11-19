import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';

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

  // Get relative time for last contact
  const getContactRecency = () => {
    if (!lastContactedAt) return null;
    const daysAgo = Math.floor((new Date().getTime() - new Date(lastContactedAt).getTime()) / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`;
    return `${Math.floor(daysAgo / 365)} years ago`;
  };

  // Get relative time for follow-up
  const getFollowUpRecency = () => {
    if (!nextFollowUpAt) return null;
    const daysUntil = Math.floor((new Date(nextFollowUpAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      const daysOverdue = Math.abs(daysUntil);
      if (daysOverdue === 0) return 'Today';
      if (daysOverdue === 1) return '1 day overdue';
      return `${daysOverdue} days overdue`;
    }

    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil < 7) return `In ${daysUntil} days`;
    if (daysUntil < 30) return `In ${Math.floor(daysUntil / 7)} weeks`;
    return `In ${Math.floor(daysUntil / 30)} months`;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs text-gray-400 uppercase mb-1">Last Contacted</div>
        <div className="text-sm text-gray-200">
          {lastContactedAt ? format(lastContactedAt, 'MMM d, yyyy') : 'Never'}
        </div>
        {lastContactedAt && (
          <div className="text-xs text-gray-500 mt-1">
            {getContactRecency()}
          </div>
        )}
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
        {nextFollowUpAt && (
          <div className={`text-xs mt-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
            {getFollowUpRecency()}
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="text-xs text-gray-400 uppercase mb-1">Contact Frequency</div>
        <div className="text-sm text-gray-200">{contactFrequency || 'Not set'}</div>
      </div>
    </div>
  );
}
