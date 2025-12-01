'use client';

import { ProposalElement, type ElementType } from '@/types/proposal';
import { ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CanvasProps {
  elements: ProposalElement[];
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onMoveElement: (elementId: string, direction: 'up' | 'down') => void;
  onDeleteElement: (elementId: string) => void;
  onAddElement: (elementType: ElementType) => void;
}

export function Canvas({
  elements,
  selectedElementId,
  onSelectElement,
  onMoveElement,
  onDeleteElement,
}: CanvasProps) {
  return (
    <div className="flex-1 bg-gray-900 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Canvas Content */}
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-700 rounded-lg">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">Your proposal is empty</p>
              <p className="text-sm">Add elements from the left sidebar to start building</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {elements.map((element, index) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                isFirst={index === 0}
                isLast={index === elements.length - 1}
                onSelect={() => onSelectElement(element.id)}
                onMoveUp={() => onMoveElement(element.id, 'up')}
                onMoveDown={() => onMoveElement(element.id, 'down')}
                onDelete={() => onDeleteElement(element.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CanvasElementProps {
  element: ProposalElement;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

function CanvasElement({
  element,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CanvasElementProps) {
  return (
    <div
      className={cn(
        'relative p-6 bg-gray-800 border-2 rounded-lg cursor-pointer transition-colors group',
        isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-600'
      )}
      onClick={onSelect}
    >
      {/* Element Controls */}
      <div
        className={cn(
          'absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
          isSelected && 'opacity-100'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={isFirst}
          className="p-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-white"
          title="Move up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={isLast}
          className="p-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-white"
          title="Move down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 bg-red-600 hover:bg-red-700 rounded text-white"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Element Label */}
      <div className="text-xs font-semibold text-gray-400 uppercase mb-3">
        {element.type.replace('_', ' ')}
      </div>

      {/* Element Preview */}
      <ElementPreview element={element} />
    </div>
  );
}

function ElementPreview({ element }: { element: ProposalElement }) {
  switch (element.type) {
    case 'hero':
      return (
        <div
          className="p-8 rounded"
          style={{
            backgroundColor: element.config.backgroundColor || '#1a1a1a',
            color: element.config.textColor || '#ffffff',
            textAlign: element.config.textAlign || 'center',
          }}
        >
          <h1 className="text-3xl font-bold mb-2">{element.config.title || 'Hero Title'}</h1>
          <p className="text-lg text-gray-300">{element.config.subtitle || 'Subtitle'}</p>
        </div>
      );

    case 'number_input':
      return (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            {element.config.label || 'Number Input'}
            {element.config.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            type="number"
            placeholder={element.config.placeholder || 'Enter number'}
            defaultValue={element.config.defaultValue}
            min={element.config.min}
            max={element.config.max}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            readOnly
          />
          {element.config.helpText && (
            <p className="text-xs text-gray-400 mt-1">{element.config.helpText}</p>
          )}
        </div>
      );

    case 'service_toggles':
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            {element.config.label || 'Services'}
          </h3>
          <div
            className={cn(
              'gap-4',
              element.config.layout === 'grid' ? 'grid grid-cols-2' : 'flex flex-col'
            )}
          >
            {element.config.services?.map((service: any) => (
              <div
                key={service.id}
                className="p-4 bg-gray-700 border border-gray-600 rounded"
              >
                <div className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked={service.defaultEnabled} readOnly />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{service.name}</h4>
                    <p className="text-sm text-gray-400">{service.description}</p>
                    <p className="text-sm font-semibold mt-2 text-green-400">
                      ${service.basePrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'pricing_summary':
      return (
        <div className="p-6 bg-gray-700 rounded border border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-white">
            {element.config.label || 'Total Investment'}
          </h3>
          {element.config.showBreakdown && (
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              {element.config.showTax && (
                <div className="flex justify-between text-gray-300">
                  <span>Tax ({element.config.taxRate || 0}%)</span>
                  <span>$0.00</span>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-gray-600">
            <span>Total</span>
            <span>{element.config.currencySymbol || '$'}0.00</span>
          </div>
        </div>
      );

    case 'submit_button':
      return (
        <button
          className={cn(
            'px-6 py-3 rounded font-semibold',
            element.config.variant === 'primary'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white',
            element.config.size === 'sm' && 'px-4 py-2 text-sm',
            element.config.size === 'lg' && 'px-8 py-4 text-lg',
            element.config.fullWidth && 'w-full'
          )}
        >
          {element.config.label || 'Submit'}
        </button>
      );

    default:
      return (
        <div className="text-gray-400 text-sm">
          <p>Preview not available for {element.type}</p>
          <pre className="mt-2 text-xs">{JSON.stringify(element.config, null, 2)}</pre>
        </div>
      );
  }
}
