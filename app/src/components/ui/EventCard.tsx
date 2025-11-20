import { Calendar, Clock, Users, Package } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface EventCardProps {
  eventName: string;
  clientName: string;
  eventType: 'RECITAL' | 'CORPORATE' | 'CONCERT' | 'COMPETITION' | 'OTHER';
  status: 'CONFIRMED' | 'BOOKED' | 'TENTATIVE' | 'PROPOSAL' | 'PLANNING';
  loadInTime: Date;
  operatorCount: number;
  kitCount: number;
  onClick?: () => void;
}

/**
 * EventCard - Display event summary on calendar
 *
 * Used in: Planning Page calendar grid
 * Design: Dark theme with status color-coding
 */
export function EventCard({
  eventName,
  clientName,
  eventType,
  status,
  loadInTime,
  operatorCount,
  kitCount,
  onClick,
}: EventCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-3 hover:border-green-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
    >
      {/* Status Indicator */}
      <div className="absolute top-0 right-0 m-2">
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Event Info */}
      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-semibold text-white truncate pr-20">
            {eventName}
          </h3>
          <p className="text-xs text-slate-400 truncate">{clientName}</p>
        </div>

        {/* Event Type Badge */}
        <div className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
          {eventType}
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          <span>
            {loadInTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>

        {/* Assignments */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{operatorCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            <span>{kitCount}</span>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
