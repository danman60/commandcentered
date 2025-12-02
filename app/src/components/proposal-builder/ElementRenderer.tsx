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

    case 'service_toggles':
      return <ServiceTogglesElement element={element} register={register} formValues={formValues} />;

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
