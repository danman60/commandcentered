'use client';

import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

/**
 * Modal - Reusable modal dialog component
 *
 * Features:
 * - 80% width, centered on screen
 * - Dark overlay backdrop (semi-transparent with blur)
 * - Close button (X in top-right corner)
 * - Escape key to close
 * - Click backdrop to close
 * - Smooth fade-in animation
 * - Dark theme styling matching mockups
 * - React portals for mounting at document root
 *
 * Usage:
 * <Modal isOpen={isOpen} onClose={handleClose} title="Event Details">
 *   <YourContent />
 * </Modal>
 */
export function Modal({ isOpen, onClose, title, children, className, 'data-testid': dataTestId }: ModalProps) {
  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* Backdrop - Click to close */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(10,14,39,0.9)] backdrop-blur-[10px] animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        data-testid={dataTestId}
        className={cn(
          'relative w-[80%] max-w-[1200px] max-h-[90vh] flex flex-col',
          'bg-gradient-to-br from-slate-900/95 to-slate-800/95',
          'rounded-2xl border border-green-400/30',
          'shadow-[0_24px_48px_rgba(0,0,0,0.5)]',
          'animate-in fade-in zoom-in duration-200',
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-8 py-6 bg-[rgba(10,14,39,0.8)] border-b border-green-400/20">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Close button without header */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </div>

        {/* Custom scrollbar styling */}
        <style jsx global>{`
          .modal-scrollable::-webkit-scrollbar {
            width: 8px;
          }
          .modal-scrollable::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.5);
          }
          .modal-scrollable::-webkit-scrollbar-thumb {
            background: rgba(56, 189, 248, 0.3);
            border-radius: 4px;
          }
          .modal-scrollable::-webkit-scrollbar-thumb:hover {
            background: rgba(56, 189, 248, 0.5);
          }
        `}</style>
      </div>
    </div>
  );

  // Use portal to mount at document root
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
