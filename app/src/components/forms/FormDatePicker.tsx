'use client';

import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  showTime?: boolean;
}

/**
 * FormDatePicker - Date/time picker with validation
 *
 * Integrates with React Hook Form via forwardRef
 * Features: Date picker, optional time, error message
 *
 * Usage:
 * ```tsx
 * <FormDatePicker
 *   label="Load-In Date"
 *   showTime
 *   {...register('loadInTime')}
 *   error={errors.loadInTime?.message}
 * />
 * ```
 */
export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({ label, error, helperText, showTime = false, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-200">{label}</label>

        <div className="relative">
          <input
            ref={ref}
            type={showTime ? 'datetime-local' : 'date'}
            className={cn(
              'w-full pl-10 pr-3 py-2 rounded-lg',
              'bg-slate-800 border border-slate-700',
              'text-white',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />

          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

FormDatePicker.displayName = 'FormDatePicker';
