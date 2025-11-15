'use client';

import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: 'bg-red-500/20 text-red-400 border-red-500/30',
    button: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
  info: {
    icon: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
  },
};

/**
 * ConfirmDialog - Confirmation modal for destructive actions
 *
 * Used for: Delete confirmations, irreversible actions
 * Features: Variant styling (danger/warning/info), loading state
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = variantConfig[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative bg-slate-800 rounded-lg border border-slate-700 shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={cn('inline-flex items-center justify-center h-12 w-12 rounded-full border mb-4', config.icon)}>
            <AlertTriangle className="h-6 w-6" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>

          {/* Description */}
          <p className="text-sm text-slate-400 mb-6">{description}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                config.button
              )}
            >
              {isLoading ? 'Loading...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
