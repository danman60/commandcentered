'use client';

import type { ProposalElement } from '@/types/proposal';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ElementRendererProps {
  element: ProposalElement;
  register: UseFormRegister<any>;
  formValues: Record<string, any>;
  errors: FieldErrors;
  pricing: {
    subtotal: number;
    lineItems: Array<{ label: string; quantity?: number; unitPrice?: number; total: number }>;
    taxAmount?: number;
    discountAmount?: number;
    total: number;
  } | null;
}

export function ElementRenderer({
  element,
  register,
  formValues,
  errors,
  pricing,
}: ElementRendererProps) {
  switch (element.type) {
    case 'hero':
      return <HeroElement element={element} />;

    case 'number_input':
      return <NumberInputElement element={element} register={register} errors={errors} />;

    case 'text_input':
      return <TextInputElement element={element} register={register} errors={errors} />;

    case 'textarea':
      return <TextareaElement element={element} register={register} errors={errors} />;

    case 'date_picker':
      return <DatePickerElement element={element} register={register} errors={errors} />;

    case 'dropdown':
      return <DropdownElement element={element} register={register} errors={errors} />;

    case 'radio_group':
      return <RadioGroupElement element={element} register={register} errors={errors} />;

    case 'checkbox_group':
      return <CheckboxGroupElement element={element} register={register} formValues={formValues} />;

    case 'service_toggles':
      return <ServiceTogglesElement element={element} register={register} formValues={formValues} />;

    case 'pricing_tiers':
      return <PricingTiersElement element={element} formValues={formValues} />;

    case 'package_tiers':
      return <PackageTiersElement element={element} register={register} formValues={formValues} />;

    case 'rich_text':
      return <RichTextElement element={element} />;

    case 'image':
      return <ImageElement element={element} />;

    case 'video':
      return <VideoElement element={element} />;

    case 'pricing_summary':
      return <PricingSummaryElement element={element} pricing={pricing} />;

    case 'submit_button':
      return <SubmitButtonElement element={element} />;

    case 'divider':
      return <DividerElement element={element} />;

    default:
      return null;
  }
}

// Individual element components

function HeroElement({ element }: { element: ProposalElement }) {
  return (
    <div
      className="rounded-lg p-8 sm:p-12"
      style={{
        backgroundColor: element.config.backgroundColor || '#1a1a1a',
        color: element.config.textColor || '#ffffff',
        textAlign: element.config.textAlign || 'center',
      }}
    >
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        {element.config.title || 'Proposal'}
      </h1>
      {element.config.subtitle && (
        <p className="text-lg sm:text-xl opacity-90">
          {element.config.subtitle}
        </p>
      )}
    </div>
  );
}

function NumberInputElement({
  element,
  register,
  errors,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  const fieldName = element.config.pricingVariable || element.id;
  const error = errors[fieldName];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {element.config.label}
        {element.config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        {...register(fieldName, {
          required: element.config.required ? `${element.config.label} is required` : false,
          min: element.config.min ? { value: element.config.min, message: `Minimum value is ${element.config.min}` } : undefined,
          max: element.config.max ? { value: element.config.max, message: `Maximum value is ${element.config.max}` } : undefined,
          valueAsNumber: true,
        })}
        placeholder={element.config.placeholder}
        defaultValue={element.config.defaultValue}
        min={element.config.min}
        max={element.config.max}
        step={element.config.step || 1}
        className={cn(
          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {element.config.helpText && !error && (
        <p className="text-sm text-gray-500 mt-1">{element.config.helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}

function TextInputElement({
  element,
  register,
  errors,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  const fieldName = element.id;
  const error = errors[fieldName];

  const validation: any = {
    required: element.config.required ? `${element.config.label} is required` : false,
    maxLength: element.config.maxLength ? { value: element.config.maxLength, message: `Maximum ${element.config.maxLength} characters` } : undefined,
  };

  if (element.config.validation === 'email') {
    validation.pattern = { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' };
  } else if (element.config.validation === 'phone') {
    validation.pattern = { value: /^[\d\s\-\(\)\+]+$/, message: 'Invalid phone number' };
  } else if (element.config.validation === 'url') {
    validation.pattern = { value: /^https?:\/\/.+/, message: 'Invalid URL' };
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {element.config.label}
        {element.config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        {...register(fieldName, validation)}
        placeholder={element.config.placeholder}
        maxLength={element.config.maxLength}
        className={cn(
          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}

function TextareaElement({
  element,
  register,
  errors,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  const fieldName = element.id;
  const error = errors[fieldName];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {element.config.label}
        {element.config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...register(fieldName, {
          required: element.config.required ? `${element.config.label} is required` : false,
          maxLength: element.config.maxLength ? { value: element.config.maxLength, message: `Maximum ${element.config.maxLength} characters` } : undefined,
        })}
        placeholder={element.config.placeholder}
        rows={element.config.rows || 4}
        maxLength={element.config.maxLength}
        className={cn(
          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}

function ServiceTogglesElement({
  element,
  register,
  formValues,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  formValues: Record<string, any>;
}) {
  const services = element.config.services || [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {element.config.label}
      </h3>
      <div
        className={cn(
          'gap-4',
          element.config.layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2' : 'flex flex-col'
        )}
      >
        {services.map((service: any) => {
          const fieldName = `services.${service.id}`;
          const isChecked = formValues[fieldName] || service.defaultEnabled;

          return (
            <label
              key={service.id}
              className={cn(
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md',
                isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register(fieldName)}
                  defaultChecked={service.defaultEnabled}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    ${service.basePrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function PricingSummaryElement({
  element,
  pricing,
}: {
  element: ProposalElement;
  pricing: ElementRendererProps['pricing'];
}) {
  if (!pricing) return null;

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 shadow-lg border-2 border-blue-200',
        element.config.position === 'sticky' && 'lg:sticky lg:top-4'
      )}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {element.config.label || 'Total Investment'}
      </h3>

      {element.config.showBreakdown && pricing.lineItems.length > 0 && (
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
          {pricing.lineItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.label}
                {item.quantity && item.unitPrice && (
                  <span className="text-gray-500 ml-1">
                    ({item.quantity} × ${item.unitPrice.toFixed(2)})
                  </span>
                )}
              </span>
              <span className="font-medium text-gray-900">
                ${item.total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {element.config.showBreakdown && (
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Subtotal</span>
            <span className="font-medium text-gray-900">
              ${pricing.subtotal.toFixed(2)}
            </span>
          </div>

          {element.config.showTax && pricing.taxAmount !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">
                Tax ({((element.config.taxRate || 0) * 100).toFixed(1)}%)
              </span>
              <span className="font-medium text-gray-900">
                ${pricing.taxAmount.toFixed(2)}
              </span>
            </div>
          )}

          {pricing.discountAmount !== undefined && pricing.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Discount</span>
              <span className="font-medium text-green-600">
                -${pricing.discountAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-3xl font-bold text-blue-600">
          {element.config.currencySymbol || '$'}{pricing.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function SubmitButtonElement({ element }: { element: ProposalElement }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <button
        type="submit"
        className={cn(
          'px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          element.config.variant === 'primary'
            ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            : 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
          element.config.size === 'sm' && 'px-4 py-2 text-sm',
          element.config.size === 'lg' && 'px-8 py-4 text-lg',
          element.config.fullWidth && 'w-full'
        )}
      >
        {element.config.label || 'Submit'}
      </button>
    </div>
  );
}

function DatePickerElement({
  element,
  register,
  errors,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  const fieldName = element.id;
  const error = errors[fieldName];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {element.config.label}
        {element.config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        {...register(fieldName, {
          required: element.config.required ? `${element.config.label} is required` : false,
        })}
        min={element.config.minDate}
        max={element.config.maxDate}
        defaultValue={element.config.defaultValue}
        className={cn(
          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {element.config.helpText && !error && (
        <p className="text-sm text-gray-500 mt-1">{element.config.helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}

function DropdownElement({
  element,
  register,
  errors,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  const fieldName = element.id;
  const error = errors[fieldName];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {element.config.label}
        {element.config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...register(fieldName, {
          required: element.config.required ? `${element.config.label} is required` : false,
        })}
        defaultValue={element.config.defaultValue || ''}
        className={cn(
          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      >
        <option value="">Select an option...</option>
        {element.config.options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.priceModifier && ` (+$${option.priceModifier})`}
          </option>
        ))}
      </select>
      {element.config.helpText && !error && (
        <p className="text-sm text-gray-500 mt-1">{element.config.helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}

function RadioGroupElement({
  element,
  register,
  errors,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}) {
  const fieldName = element.id;
  const error = errors[fieldName];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-900 mb-3">
        {element.config.label}
        {element.config.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={cn(
          'space-y-2',
          element.config.layout === 'horizontal' && 'flex gap-4 space-y-0'
        )}
      >
        {element.config.options?.map((option: any) => (
          <label
            key={option.value}
            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              {...register(fieldName, {
                required: element.config.required ? `${element.config.label} is required` : false,
              })}
              value={option.value}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <p className="text-sm text-gray-600">{option.description}</p>
              )}
              {option.priceModifier && (
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  +${option.priceModifier}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error.message as string}</p>
      )}
    </div>
  );
}

function CheckboxGroupElement({
  element,
  register,
  formValues,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  formValues: Record<string, any>;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-900 mb-3">
        {element.config.label}
      </label>
      <div
        className={cn(
          'space-y-2',
          element.config.layout === 'horizontal' && 'flex flex-wrap gap-4 space-y-0'
        )}
      >
        {element.config.options?.map((option: any) => (
          <label
            key={option.value}
            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              {...register(`${element.id}.${option.value}`)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <p className="text-sm text-gray-600">{option.description}</p>
              )}
              {option.priceModifier && (
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  +${option.priceModifier}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function PricingTiersElement({
  element,
  formValues,
}: {
  element: ProposalElement;
  formValues: Record<string, any>;
}) {
  const quantity = formValues[element.config.basedOn] || 0;
  const tiers = element.config.tiers || [];

  // Find active tier
  const activeTier = tiers.find((tier: any) => {
    if (quantity < tier.minQty) return false;
    if (tier.maxQty === null) return true;
    return quantity <= tier.maxQty;
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {element.config.label || 'Pricing'}
      </h3>
      <div className="space-y-2">
        {tiers.map((tier: any, index: number) => {
          const isActive = activeTier === tier;
          return (
            <div
              key={index}
              className={cn(
                'p-4 border-2 rounded-lg transition-all',
                isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              )}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {tier.label || `${tier.minQty}-${tier.maxQty || '∞'} units`}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ${tier.pricePerUnit}/unit
                </span>
              </div>
              {isActive && element.config.showCalculation && quantity > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {quantity} × ${tier.pricePerUnit} = ${(quantity * tier.pricePerUnit).toFixed(2)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PackageTiersElement({
  element,
  register,
  formValues,
}: {
  element: ProposalElement;
  register: UseFormRegister<any>;
  formValues: Record<string, any>;
}) {
  const packages = element.config.packages || [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {element.config.label || 'Choose Your Package'}
      </h3>
      <div
        className={cn(
          'gap-4',
          element.config.layout === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
        )}
      >
        {packages.map((pkg: any) => {
          const fieldName = `package.${pkg.id}`;
          const isSelected = formValues[fieldName];

          return (
            <label
              key={pkg.id}
              className={cn(
                'relative p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg',
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white',
                pkg.recommended && 'ring-2 ring-blue-400'
              )}
            >
              {pkg.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Recommended
                </span>
              )}
              <input
                type={element.config.allowMultiple ? 'checkbox' : 'radio'}
                {...register(fieldName)}
                className="sr-only"
              />
              <div className="text-center">
                {pkg.icon && <div className="text-4xl mb-3">{pkg.icon}</div>}
                <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h4>
                <p className="text-3xl font-bold text-blue-600 mb-4">${pkg.price.toLocaleString()}</p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  {pkg.features?.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function RichTextElement({ element }: { element: ProposalElement }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div
        className={cn(
          'prose max-w-none',
          element.config.fontSize === 'sm' && 'text-sm',
          element.config.fontSize === 'lg' && 'text-lg'
        )}
        style={{ textAlign: element.config.textAlign || 'left' }}
        dangerouslySetInnerHTML={{ __html: element.config.content || '' }}
      />
    </div>
  );
}

function ImageElement({ element }: { element: ProposalElement }) {
  if (!element.config.src) return null;

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <img
        src={element.config.src}
        alt={element.config.alt || ''}
        className={cn(
          'rounded-lg',
          alignmentClasses[element.config.alignment as keyof typeof alignmentClasses] || 'mx-auto'
        )}
        style={{ width: element.config.width ? `${element.config.width}%` : 'auto' }}
      />
      {element.config.caption && (
        <p className="text-sm text-gray-600 text-center mt-2">{element.config.caption}</p>
      )}
    </div>
  );
}

function VideoElement({ element }: { element: ProposalElement }) {
  if (!element.config.embedUrl) return null;

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className={cn('w-full rounded-lg overflow-hidden', aspectRatioClasses[element.config.aspectRatio as keyof typeof aspectRatioClasses] || 'aspect-video')}>
        <iframe
          src={element.config.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function DividerElement({ element }: { element: ProposalElement }) {
  const spacingClasses = {
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
  };

  return (
    <div className={spacingClasses[element.config.spacing as keyof typeof spacingClasses] || 'my-8'}>
      <hr
        className={cn(
          element.config.style === 'dashed' && 'border-dashed',
          element.config.style === 'dotted' && 'border-dotted'
        )}
        style={{
          borderColor: element.config.color || '#e5e7eb',
        }}
      />
    </div>
  );
}
