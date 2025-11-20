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
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border border-slate-700 mb-4">
        <Icon className="h-8 w-8 text-slate-500" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>

      {description && <p className="text-sm text-slate-400 text-center max-w-sm mb-6">{description}</p>}

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-purple-600 text-white font-medium hover:from-green-600 hover:to-purple-700 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
