'use client';

import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

/**
 * ResponsiveModal Component
 *
 * Wraps existing modal content with responsive behavior:
 * - Desktop: Centered modal with max-width
 * - Mobile: Full-screen modal with smooth slide-up animation
 */
export function ResponsiveModal({ isOpen, onClose, children, title }: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={`
          relative z-10 bg-slate-800 border border-slate-700 overflow-hidden
          ${isMobile
            ? 'fixed inset-0 rounded-none animate-slide-up'
            : 'rounded-xl w-full max-w-4xl max-h-[90vh] mx-4'
          }
        `}
      >
        {/* Mobile Header Bar */}
        {isMobile && title && (
          <div className="sticky top-0 z-20 bg-slate-800/95 backdrop-blur-lg border-b border-slate-700 px-4 py-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white truncate">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <span className="text-2xl text-slate-400">×</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className={isMobile ? 'overflow-y-auto h-full pb-safe' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for mobile-optimized modal behavior
 */
export function useMobileModal() {
  const isMobile = useIsMobile();

  return {
    isMobile,
    modalClassName: isMobile
      ? 'fixed inset-0 rounded-none'
      : 'rounded-xl w-full max-w-4xl max-h-[90vh]',
    contentClassName: isMobile
      ? 'h-full overflow-y-auto pb-safe'
      : 'max-h-[90vh] overflow-y-auto',
  };
}
