'use client';

import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: SortConfig | null;
  onSort: (key: string) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * SortableTableHeader - Reusable sortable column header
 *
 * Features:
 * - Click to toggle sort direction
 * - Visual indicator of current sort state
 * - Hover state
 * - Keyboard accessible
 *
 * Usage:
 * <SortableTableHeader
 *   label="Name"
 *   sortKey="name"
 *   currentSort={sortConfig}
 *   onSort={handleSort}
 * />
 */
export function SortableTableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  className = '',
  align = 'left',
}: SortableTableHeaderProps) {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  const handleClick = () => {
    onSort(sortKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSort(sortKey);
    }
  };

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <th
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-sort={
        isActive
          ? direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      className={`
        cursor-pointer select-none
        hover:bg-slate-800/50 transition-colors
        px-4 py-3
        ${className}
      `}
    >
      <div className={`flex items-center gap-2 ${alignClasses[align]}`}>
        <span className="font-medium text-slate-300">{label}</span>
        <div className="flex-shrink-0">
          {!isActive && (
            <ChevronsUpDown className="w-4 h-4 text-slate-500" />
          )}
          {isActive && direction === 'asc' && (
            <ArrowUp className="w-4 h-4 text-green-500" />
          )}
          {isActive && direction === 'desc' && (
            <ArrowDown className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>
    </th>
  );
}

/**
 * useSorting - Hook for managing table sorting state
 *
 * Usage:
 * const { sortConfig, handleSort, sortedData } = useSorting(data, 'name');
 */
export function useSorting<T extends Record<string, any>>(
  data: T[],
  defaultKey: string = '',
  defaultDirection: 'asc' | 'desc' = 'asc'
) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(
    defaultKey ? { key: defaultKey, direction: defaultDirection } : null
  );

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      // If clicking the same column, toggle direction
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // If clicking a new column, sort ascending
      return { key, direction: 'asc' };
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        // Fallback to string comparison
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortConfig]);

  return { sortConfig, handleSort, sortedData };
}

// Import React at top
import React from 'react';
