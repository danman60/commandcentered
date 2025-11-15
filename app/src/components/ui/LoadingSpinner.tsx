import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

/**
 * LoadingSpinner - Animated loading indicator
 *
 * Used throughout app for loading states
 * Features: Gradient border animation, size variants
 */
export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-transparent border-t-cyan-500 border-r-purple-500',
          sizeClasses[size]
        )}
      />
    </div>
  );
}

/**
 * LoadingPage - Full-page loading state
 */
export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-slate-400 text-sm">{message}</p>
    </div>
  );
}

/**
 * LoadingOverlay - Overlay loading state for modals/sections
 */
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50 rounded-lg">
      <LoadingSpinner size="lg" />
      {message && <p className="mt-4 text-slate-300 text-sm">{message}</p>}
    </div>
  );
}
