import { Clock, User, Package, AlertTriangle } from 'lucide-react';
import { OperatorBadge } from './OperatorBadge';
import { StatusBadge } from './StatusBadge';

export interface ShiftCardProps {
  shiftName: string;
  startTime: Date;
  endTime: Date;
  operator?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  kitAssigned?: {
    id: string;
    kitName: string;
  };
  hasConflict?: boolean;
  conflictMessage?: string;
  onAssignOperator?: () => void;
  onAssignKit?: () => void;
  onRemove?: () => void;
}

/**
 * ShiftCard - Display shift details in Event Detail Modal
 *
 * Used in: Event Detail Modal shift builder
 * Features: Operator assignment, kit assignment, conflict detection
 */
export function ShiftCard({
  shiftName,
  startTime,
  endTime,
  operator,
  kitAssigned,
  hasConflict,
  conflictMessage,
  onAssignOperator,
  onAssignKit,
  onRemove,
}: ShiftCardProps) {
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // hours

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">{shiftName}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            <span>
              {startTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}{' '}
              -{' '}
              {endTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
            <span className="text-slate-500">({duration}h)</span>
          </div>
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Remove shift"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Conflict Alert */}
      {hasConflict && (
        <div className="flex items-start gap-2 p-2 rounded bg-red-500/10 border border-red-500/30">
          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-400">{conflictMessage}</p>
        </div>
      )}

      {/* Operator Assignment */}
      <div>
        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Operator</label>
        {operator ? (
          <OperatorBadge
            firstName={operator.firstName}
            lastName={operator.lastName}
            avatarUrl={operator.avatarUrl}
            size="md"
          />
        ) : (
          <button
            onClick={onAssignOperator}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-dashed border-slate-600 text-slate-400 hover:border-green-500 hover:text-green-400 transition-colors text-sm"
          >
            <User className="h-4 w-4" />
            <span>Assign Operator</span>
          </button>
        )}
      </div>

      {/* Kit Assignment */}
      <div>
        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Kit (Override)</label>
        {kitAssigned ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700/50 border border-slate-600">
            <Package className="h-4 w-4 text-green-400" />
            <span className="text-sm text-white">{kitAssigned.kitName}</span>
          </div>
        ) : (
          <button
            onClick={onAssignKit}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-dashed border-slate-600 text-slate-400 hover:border-green-500 hover:text-green-400 transition-colors text-sm"
          >
            <Package className="h-4 w-4" />
            <span>Assign Kit</span>
          </button>
        )}
      </div>
    </div>
  );
}
