'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCounter?: boolean;
}

/**
 * FormTextarea - Multi-line text input with character counter
 *
 * Integrates with React Hook Form via forwardRef
 * Features: Label, error message, character counter
 *
 * Usage:
 * ```tsx
 * <FormTextarea
 *   label="Event Notes"
 *   maxLength={500}
 *   showCounter
 *   {...register('notes')}
 *   error={errors.notes?.message}
 * />
 * ```
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, maxLength, showCounter = true, className, value, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);

    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-200">{label}</label>

        <textarea
          ref={ref}
          value={value}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e);
          }}
          maxLength={maxLength}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'bg-slate-800 border border-slate-700',
            'text-white placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-y min-h-[100px]',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
          </div>

          {showCounter && maxLength && (
            <p className="text-xs text-slate-400">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
