import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * EmptyState - No data placeholder with CTA
 *
 * Used throughout app when lists/grids are empty
 * Features: Icon, title, description, optional action button
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="flex items-center justify-center h-16 w-16 rounded-full tactical-glass tactical-border mb-4">
        <Icon className="h-8 w-8 text-green-400" style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' }} />
      </div>

      <h3 className="text-lg font-semibold text-white mb-1 tactical-text-glow">{title}</h3>

      {description && <p className="text-sm text-slate-300 text-center max-w-sm mb-6">{description}</p>}

      {action && (
        <button
          onClick={action.onClick}
          className="tactical-button-primary px-6 py-3 rounded-lg font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
