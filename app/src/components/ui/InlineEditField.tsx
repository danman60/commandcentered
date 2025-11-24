'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface InlineEditFieldProps<T = string> {
  value: T;
  onSave: (newValue: T) => Promise<void>;
  type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'url' | 'textarea';
  placeholder?: string;
  className?: string;
  displayClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  formatDisplay?: (value: T) => string;
  validateInput?: (value: T) => boolean | string;
  multiline?: boolean;
  rows?: number;
}

/**
 * InlineEditField - Reusable inline editing component
 *
 * Features:
 * - Click to edit mode
 * - Save on blur or Enter key
 * - Cancel on Escape key
 * - Loading state during save
 * - Validation support
 * - Custom display formatting
 * - Works with text, number, date, email, etc.
 *
 * Usage:
 * <InlineEditField
 *   value={lead.organization}
 *   onSave={async (newValue) => {
 *     await updateLead.mutateAsync({ id: lead.id, organization: newValue });
 *   }}
 *   placeholder="Company name"
 * />
 */
export function InlineEditField<T = string>({
  value,
  onSave,
  type = 'text',
  placeholder = 'Click to edit',
  className = '',
  displayClassName = '',
  inputClassName = '',
  disabled = false,
  formatDisplay,
  validateInput,
  multiline = false,
  rows = 3,
}: InlineEditFieldProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Reset current value when prop value changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text' || type === 'textarea') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleSave = async () => {
    // Don't save if value hasn't changed
    if (currentValue === value) {
      setIsEditing(false);
      setError(null);
      return;
    }

    // Validate input if validator provided
    if (validateInput) {
      const validationResult = validateInput(currentValue);
      if (validationResult === false || typeof validationResult === 'string') {
        setError(typeof validationResult === 'string' ? validationResult : 'Invalid value');
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to save');
      setCurrentValue(value); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.shiftKey) {
      // Shift+Enter in textarea should add new line (default behavior)
      return;
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleClick = () => {
    if (!disabled && !isEditing) {
      setIsEditing(true);
    }
  };

  const displayValue = formatDisplay ? formatDisplay(value) : String(value || '');

  if (!isEditing) {
    return (
      <div
        onClick={handleClick}
        className={`
          cursor-pointer hover:bg-slate-700/30 px-2 py-1 rounded transition-colors
          ${!value && 'text-slate-500 italic'}
          ${disabled && 'cursor-not-allowed opacity-50'}
          ${displayClassName}
          ${className}
        `}
        title={disabled ? undefined : 'Click to edit'}
      >
        {displayValue || placeholder}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={String(currentValue || '')}
          onChange={(e) => setCurrentValue(e.target.value as T)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          rows={rows}
          className={`
            w-full px-2 py-1 bg-slate-800 border rounded focus:outline-none resize-none
            ${error ? 'border-red-500' : 'border-green-500'}
            ${isSaving && 'opacity-50 cursor-not-allowed'}
            ${inputClassName}
          `}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          value={String(currentValue || '')}
          onChange={(e) => {
            const newValue = type === 'number'
              ? (parseFloat(e.target.value) as T)
              : (e.target.value as T);
            setCurrentValue(newValue);
          }}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className={`
            w-full px-2 py-1 bg-slate-800 border rounded focus:outline-none
            ${error ? 'border-red-500' : 'border-green-500'}
            ${isSaving && 'opacity-50 cursor-not-allowed'}
            ${inputClassName}
          `}
        />
      )}

      {/* Loading indicator */}
      {isSaving && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-green-500" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute left-0 top-full mt-1 text-xs text-red-400 whitespace-nowrap">
          {error}
        </div>
      )}

      {/* Hint text */}
      {!error && !isSaving && (
        <div className="absolute left-0 top-full mt-1 text-xs text-slate-500 whitespace-nowrap">
          Enter to save • Esc to cancel
        </div>
      )}
    </div>
  );
}

/**
 * InlineEditSelect - Dropdown variant of inline edit
 */
interface InlineEditSelectProps<T = string> {
  value: T;
  options: Array<{ label: string; value: T }>;
  onSave: (newValue: T) => Promise<void>;
  className?: string;
  displayClassName?: string;
  disabled?: boolean;
  formatDisplay?: (value: T) => string;
}

export function InlineEditSelect<T = string>({
  value,
  options,
  onSave,
  className = '',
  displayClassName = '',
  disabled = false,
  formatDisplay,
}: InlineEditSelectProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
      setCurrentValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as T;
    setCurrentValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const displayValue = formatDisplay
    ? formatDisplay(value)
    : options.find((opt) => opt.value === value)?.label || String(value);

  if (!isEditing) {
    return (
      <div
        onClick={() => !disabled && setIsEditing(true)}
        className={`
          cursor-pointer hover:bg-slate-700/30 px-2 py-1 rounded transition-colors
          ${disabled && 'cursor-not-allowed opacity-50'}
          ${displayClassName}
          ${className}
        `}
        title={disabled ? undefined : 'Click to edit'}
      >
        {displayValue}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        ref={selectRef}
        value={String(currentValue)}
        onChange={handleChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        className={`
          w-full px-2 py-1 bg-slate-800 border border-green-500 rounded focus:outline-none
          ${isSaving && 'opacity-50 cursor-not-allowed'}
        `}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>

      {isSaving && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-green-500" />
        </div>
      )}
    </div>
  );
}
