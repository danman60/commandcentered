'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

/**
 * FormSelect - Dropdown with validation
 *
 * Integrates with React Hook Form via forwardRef
 * Features: Label, options, error message, placeholder
 *
 * Usage:
 * ```tsx
 * <FormSelect
 *   label="Event Type"
 *   options={[
 *     { value: 'RECITAL', label: 'Recital' },
 *     { value: 'CORPORATE', label: 'Corporate' },
 *   ]}
 *   {...register('eventType')}
 *   error={errors.eventType?.message}
 * />
 * ```
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, helperText, placeholder, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-200">{label}</label>

        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-slate-800 border border-slate-700',
            'text-white',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
