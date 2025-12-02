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

    case 'date_picker':
      return (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            {element.config.label || 'Date'}
            {element.config.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            type="date"
            defaultValue={element.config.defaultValue}
            min={element.config.minDate}
            max={element.config.maxDate}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            readOnly
          />
          {element.config.helpText && (
            <p className="text-xs text-gray-400 mt-1">{element.config.helpText}</p>
          )}
        </div>
      );

    case 'dropdown':
      return (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            {element.config.label || 'Select Option'}
            {element.config.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
            <option>{element.config.placeholder || 'Choose...'}</option>
            {element.config.options?.map((opt: any, idx: number) => (
              <option key={idx} value={opt.value}>
                {opt.label}
                {opt.priceModifier && ` (+$${opt.priceModifier})`}
              </option>
            ))}
          </select>
          {element.config.helpText && (
            <p className="text-xs text-gray-400 mt-1">{element.config.helpText}</p>
          )}
        </div>
      );

    case 'radio_group':
      return (
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            {element.config.label || 'Choose One'}
            {element.config.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div
            className={cn(
              'gap-3',
              element.config.layout === 'horizontal' ? 'flex flex-wrap' : 'flex flex-col'
            )}
          >
            {element.config.options?.map((opt: any, idx: number) => (
              <label
                key={idx}
                className="flex items-start gap-2 p-3 bg-gray-700 border border-gray-600 rounded cursor-pointer hover:border-blue-500"
              >
                <input type="radio" name={element.id} readOnly className="mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-white">{opt.label}</div>
                  {opt.description && (
                    <div className="text-sm text-gray-400">{opt.description}</div>
                  )}
                  {opt.priceModifier && (
                    <div className="text-sm text-green-400 mt-1">
                      +${opt.priceModifier}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      );

    case 'checkbox_group':
      return (
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">
            {element.config.label || 'Select Options'}
          </label>
          <div className="space-y-2">
            {element.config.options?.map((opt: any, idx: number) => (
              <label
                key={idx}
                className="flex items-start gap-2 p-3 bg-gray-700 border border-gray-600 rounded cursor-pointer hover:border-blue-500"
              >
                <input type="checkbox" readOnly className="mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-white">{opt.label}</div>
                  {opt.description && (
                    <div className="text-sm text-gray-400">{opt.description}</div>
                  )}
                  {opt.priceModifier && (
                    <div className="text-sm text-green-400 mt-1">
                      +${opt.priceModifier}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      );

    case 'pricing_tiers':
      return (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {element.config.label || 'Pricing'}
          </h3>
          <div className="space-y-2">
            {element.config.tiers?.map((tier: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-gray-700 border-2 border-gray-600 rounded"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">
                    {tier.label || `${tier.minQty}-${tier.maxQty || '∞'} units`}
                  </span>
                  <span className="text-lg font-bold text-blue-400">
                    ${tier.pricePerUnit}/unit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'package_tiers':
      return (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {element.config.label || 'Choose Your Package'}
          </h3>
          <div
            className={cn(
              'gap-4',
              element.config.layout === 'cards'
                ? 'grid grid-cols-1 sm:grid-cols-2'
                : 'flex flex-col'
            )}
          >
            {element.config.packages?.map((pkg: any) => (
              <div
                key={pkg.id}
                className={cn(
                  'relative p-6 bg-gray-700 border-2 border-gray-600 rounded',
                  pkg.recommended && 'ring-2 ring-blue-400'
                )}
              >
                {pkg.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}
                <div className="text-center">
                  {pkg.icon && <div className="text-4xl mb-3">{pkg.icon}</div>}
                  <h4 className="text-xl font-bold text-white mb-2">{pkg.name}</h4>
                  <p className="text-3xl font-bold text-blue-400 mb-4">
                    ${pkg.price.toLocaleString()}
                  </p>
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="text-left space-y-2 text-sm text-gray-300">
                      {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'rich_text':
      return (
        <div
          className="prose prose-invert max-w-none"
          style={{ textAlign: element.config.textAlign || 'left' }}
          dangerouslySetInnerHTML={{
            __html: element.config.content || '<p class="text-gray-400">Rich text content...</p>',
          }}
        />
      );

    case 'image':
      return (
        <div>
          {element.config.imageUrl ? (
            <img
              src={element.config.imageUrl}
              alt={element.config.altText || 'Image'}
              className={cn(
                'rounded',
                element.config.width === 'full' && 'w-full',
                element.config.width === 'half' && 'w-1/2 mx-auto',
                element.config.width === 'third' && 'w-1/3 mx-auto'
              )}
            />
          ) : (
            <div className="bg-gray-700 border-2 border-dashed border-gray-600 rounded p-12 text-center text-gray-400">
              <p>Image placeholder</p>
              <p className="text-xs mt-2">Configure image URL in settings</p>
            </div>
          )}
          {element.config.caption && (
            <p className="text-sm text-gray-400 text-center mt-2">
              {element.config.caption}
            </p>
          )}
        </div>
      );

    case 'video':
      return (
        <div>
          {element.config.embedUrl ? (
            <div className="aspect-video w-full rounded overflow-hidden bg-gray-700">
              <iframe
                src={element.config.embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-700 border-2 border-dashed border-gray-600 rounded flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p>Video placeholder</p>
                <p className="text-xs mt-2">Configure embed URL in settings</p>
              </div>
            </div>
          )}
        </div>
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
