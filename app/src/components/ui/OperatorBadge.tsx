import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OperatorBadgeProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showFullName?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    avatar: 'h-6 w-6 text-xs',
    text: 'text-xs',
    gap: 'gap-1.5',
  },
  md: {
    avatar: 'h-8 w-8 text-sm',
    text: 'text-sm',
    gap: 'gap-2',
  },
  lg: {
    avatar: 'h-10 w-10 text-base',
    text: 'text-base',
    gap: 'gap-2.5',
  },
};

/**
 * OperatorBadge - Display operator with avatar + name/initials
 *
 * Used in: Events, Shifts, Operators list, Planning calendar
 * Features: Avatar fallback to initials, size variants
 */
export function OperatorBadge({
  firstName,
  lastName,
  avatarUrl,
  size = 'md',
  showFullName = true,
  className,
}: OperatorBadgeProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`;
  const config = sizeConfig[size];

  return (
    <div className={cn('inline-flex items-center', config.gap, className)}>
      {/* Avatar */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-purple-600 text-white font-semibold overflow-hidden',
          config.avatar
        )}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
        ) : (
          <span className={config.text}>{initials}</span>
        )}
      </div>

      {/* Name */}
      {showFullName && <span className={cn('font-medium text-white', config.text)}>{fullName}</span>}
    </div>
  );
}

/**
 * OperatorInitials - Display only initials (for compact calendar view)
 */
export function OperatorInitials({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-green-500 to-purple-600 text-white text-xs font-bold">
      {initials}
    </span>
  );
}
