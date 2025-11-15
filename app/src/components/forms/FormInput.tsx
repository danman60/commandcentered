'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

/**
 * FormInput - Text input with validation and error display
 *
 * Integrates with React Hook Form via forwardRef
 * Features: Label, error message, helper text, dark theme
 *
 * Usage:
 * ```tsx
 * <FormInput
 *   label="Event Name"
 *   {...register('eventName')}
 *   error={errors.eventName?.message}
 * />
 * ```
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-200">{label}</label>

        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-slate-800 border border-slate-700',
            'text-white placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
