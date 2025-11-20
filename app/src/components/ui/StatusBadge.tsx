import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status:
    | 'CONFIRMED'
    | 'BOOKED'
    | 'TENTATIVE'
    | 'PROPOSAL'
    | 'PLANNING'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'AVAILABLE'
    | 'IN_USE'
    | 'MAINTENANCE'
    | 'WON'
    | 'LOST'
    | 'DISCUSSING'
    | 'PENDING'
    | 'IN_PROGRESS';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  // Event statuses
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  BOOKED: { label: 'Booked', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  TENTATIVE: { label: 'Tentative', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  PROPOSAL: { label: 'Proposal', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  PLANNING: { label: 'Planning', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30' },

  // Gear statuses
  AVAILABLE: { label: 'Available', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  IN_USE: { label: 'In Use', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-red-500/20 text-red-400 border-red-500/30' },

  // Lead/Product statuses
  WON: { label: 'Won', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  LOST: { label: 'Lost', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  DISCUSSING: { label: 'Discussing', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },

  // General statuses
  PENDING: { label: 'Pending', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

/**
 * StatusBadge - Color-coded status labels
 *
 * Used throughout app: Events, Gear, Leads, Deliverables
 * Color scheme:
 * - Green: Confirmed, Available, Won, Completed
 * - Orange: Tentative, In Use, Discussing, Pending
 * - Red: Cancelled, Maintenance, Lost
 * - Cyan: Booked, Proposal, In Progress
 */
export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-medium backdrop-blur-sm',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}
