'use client';

import { ProposalElement } from '@/types/proposal';
import { Trash2 } from 'lucide-react';

interface SettingsPanelProps {
  element: ProposalElement | undefined;
  onUpdateConfig: (newConfig: Record<string, any>) => void;
  onDelete: () => void;
}

export function SettingsPanel({ element, onUpdateConfig, onDelete }: SettingsPanelProps) {
  if (!element) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
        <div className="text-center text-gray-400 mt-12">
          <p className="text-sm">Select an element to edit its settings</p>
        </div>
      </div>
    );
  }

  const updateField = (field: string, value: any) => {
    onUpdateConfig({
      ...element.config,
      [field]: value,
    });
  };

  const updateNestedField = (parentField: string, index: number, childField: string, value: any) => {
    const array = [...(element.config[parentField] || [])];
    array[index] = {
      ...array[index],
      [childField]: value,
    };
    onUpdateConfig({
      ...element.config,
      [parentField]: array,
    });
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    const array = [...(element.config[field] || []), defaultItem];
    onUpdateConfig({
      ...element.config,
      [field]: array,
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const array = [...(element.config[field] || [])];
    array.splice(index, 1);
    onUpdateConfig({
      ...element.config,
      [field]: array,
    });
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-4">
        {element.type.replace('_', ' ').toUpperCase()} Settings
      </h3>

      {/* Dynamic settings based on element type */}
      {element.type === 'hero' && (
        <HeroSettings config={element.config} updateField={updateField} />
      )}

      {element.type === 'number_input' && (
        <NumberInputSettings config={element.config} updateField={updateField} />
      )}

      {element.type === 'service_toggles' && (
        <ServiceTogglesSettings
          config={element.config}
          updateField={updateField}
          updateNestedField={updateNestedField}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />
      )}

      {element.type === 'pricing_summary' && (
        <PricingSummarySettings config={element.config} updateField={updateField} />
      )}

      {element.type === 'submit_button' && (
        <SubmitButtonSettings config={element.config} updateField={updateField} />
      )}

      {/* Delete Button */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Element
        </button>
      </div>
    </div>
  );
}

// Settings components for each element type

function HeroSettings({
  config,
  updateField,
}: {
  config: Record<string, any>;
  updateField: (field: string, value: any) => void;
}) {
  return (
    <>
      <SettingGroup label="Title">
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          className="setting-input"
        />
      </SettingGroup>

      <SettingGroup label="Subtitle">
        <input
          type="text"
          value={config.subtitle || ''}
          onChange={(e) => updateField('subtitle', e.target.value)}
          className="setting-input"
        />
      </SettingGroup>

      <SettingGroup label="Text Align">
        <select
          value={config.textAlign || 'center'}
          onChange={(e) => updateField('textAlign', e.target.value)}
          className="setting-input"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </SettingGroup>

      <SettingGroup label="Background Color">
        <input
          type="color"
          value={config.backgroundColor || '#1a1a1a'}
          onChange={(e) => updateField('backgroundColor', e.target.value)}
          className="setting-input h-10"
        />
      </SettingGroup>

      <SettingGroup label="Text Color">
        <input
          type="color"
          value={config.textColor || '#ffffff'}
          onChange={(e) => updateField('textColor', e.target.value)}
          className="setting-input h-10"
        />
      </SettingGroup>
    </>
  );
}

function NumberInputSettings({
  config,
  updateField,
}: {
  config: Record<string, any>;
  updateField: (field: string, value: any) => void;
}) {
  return (
    <>
      <SettingGroup label="Label">
        <input
          type="text"
          value={config.label || ''}
          onChange={(e) => updateField('label', e.target.value)}
          className="setting-input"
        />
      </SettingGroup>

      <SettingGroup label="Placeholder">
        <input
          type="text"
          value={config.placeholder || ''}
          onChange={(e) => updateField('placeholder', e.target.value)}
          className="setting-input"
        />
      </SettingGroup>

      <div className="grid grid-cols-2 gap-3">
        <SettingGroup label="Min Value">
          <input
            type="number"
            value={config.min ?? ''}
            onChange={(e) => updateField('min', e.target.value ? Number(e.target.value) : undefined)}
            className="setting-input"
          />
        </SettingGroup>

        <SettingGroup label="Max Value">
          <input
            type="number"
            value={config.max ?? ''}
            onChange={(e) => updateField('max', e.target.value ? Number(e.target.value) : undefined)}
            className="setting-input"
          />
        </SettingGroup>
      </div>

      <SettingGroup label="Default Value">
        <input
          type="number"
          value={config.defaultValue ?? ''}
          onChange={(e) => updateField('defaultValue', e.target.value ? Number(e.target.value) : undefined)}
          className="setting-input"
        />
      </SettingGroup>

      <SettingGroup label="Pricing Variable Name">
        <input
          type="text"
          value={config.pricingVariable || ''}
          onChange={(e) => updateField('pricingVariable', e.target.value)}
          className="setting-input"
          placeholder="e.g., numDancers"
        />
        <p className="text-xs text-gray-400 mt-1">Used in pricing calculations</p>
      </SettingGroup>

      <SettingGroup label="">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={config.required || false}
            onChange={(e) => updateField('required', e.target.checked)}
          />
          Required field
        </label>
      </SettingGroup>
    </>
  );
}

function ServiceTogglesSettings({
  config,
  updateField,
  updateNestedField,
  addArrayItem,
  removeArrayItem,
}: {
  config: Record<string, any>;
  updateField: (field: string, value: any) => void;
  updateNestedField: (parentField: string, index: number, childField: string, value: any) => void;
  addArrayItem: (field: string, defaultItem: any) => void;
  removeArrayItem: (field: string, index: number) => void;
}) {
  return (
    <>
      <SettingGroup label="Label">
        <input
          type="text"
          value={config.label || ''}
          onChange={(e) => updateField('label', e.target.value)}
          className="setting-input"
        />
      </SettingGroup>

      <SettingGroup label="Layout">
        <select
          value={config.layout || 'grid'}
          onChange={(e) => updateField('layout', e.target.value)}
          className="setting-input"
        >
          <option value="list">List</option>
          <option value="grid">Grid</option>
        </select>
      </SettingGroup>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">Services</label>
          <button
            onClick={() =>
              addArrayItem('services', {
                id: `service-${Date.now()}`,
                name: 'New Service',
                description: 'Description',
                basePrice: 500,
                defaultEnabled: false,
              })
            }
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            + Add Service
          </button>
        </div>

        <div className="space-y-3">
          {config.services?.map((service: any, index: number) => (
            <div key={service.id} className="p-3 bg-gray-700 rounded border border-gray-600">
              <div className="space-y-2">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateNestedField('services', index, 'name', e.target.value)}
                  className="setting-input text-sm"
                  placeholder="Service name"
                />
                <input
                  type="text"
                  value={service.description}
                  onChange={(e) => updateNestedField('services', index, 'description', e.target.value)}
                  className="setting-input text-sm"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={service.basePrice}
                  onChange={(e) => updateNestedField('services', index, 'basePrice', Number(e.target.value))}
                  className="setting-input text-sm"
                  placeholder="Price"
                />
                <button
                  onClick={() => removeArrayItem('services', index)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PricingSummarySettings({
  config,
  updateField,
}: {
  config: Record<string, any>;
  updateField: (field: string, value: any) => void;
}) {
  return (
    <>
      <SettingGroup label="Label">
        <input
          type="text"
          value={config.label || ''}
          onChange={(e) => updateField('label', e.target.value)}
          className="setting-input"
        />
      </SettingGroup>

      <SettingGroup label="">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={config.showBreakdown || false}
            onChange={(e) => updateField('showBreakdown', e.target.checked)}
          />
          Show breakdown
        </label>
      </SettingGroup>

      <SettingGroup label="">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={config.showTax || false}
            onChange={(e) => updateField('showTax', e.target.checked)}
          />
          Show tax
        </label>
      </SettingGroup>

      {config.showTax && (
        <SettingGroup label="Tax Rate (%)">
          <input
            type="number"
            value={(config.taxRate || 0) * 100}
            onChange={(e) => updateField('taxRate', Number(e.target.value) / 100)}
            className="setting-input"
            step="0.1"
          />
        </SettingGroup>
      )}

      <SettingGroup label="Currency Symbol">
        <input
          type="text"
          value={config.currencySymbol || '$'}
          onChange={(e) => updateField('currencySymbol', e.target.value)}
          className="setting-input"
          maxLength={3}
        />
      </SettingGroup>
    </>
  );
}

function SubmitButtonSettings({
  config,
  updateField,
}: {
  config: Record<string, any>;
  updateField: (field: string, value: any) => void;
}) {
  return (
    <>
      <SettingGroup label="Button Text">
        <input
          type="text"
          value={config.label || ''}
          onChange={(e) => updateField('label', e.target.value)}
          className="setting-input"
        />
      </SettingGroup>

      <SettingGroup label="Variant">
        <select
          value={config.variant || 'primary'}
          onChange={(e) => updateField('variant', e.target.value)}
          className="setting-input"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </SettingGroup>

      <SettingGroup label="Size">
        <select
          value={config.size || 'md'}
          onChange={(e) => updateField('size', e.target.value)}
          className="setting-input"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </SettingGroup>

      <SettingGroup label="">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={config.fullWidth || false}
            onChange={(e) => updateField('fullWidth', e.target.checked)}
          />
          Full width
        </label>
      </SettingGroup>

      <SettingGroup label="Success Message">
        <textarea
          value={config.successMessage || ''}
          onChange={(e) => updateField('successMessage', e.target.value)}
          className="setting-input"
          rows={3}
        />
      </SettingGroup>
    </>
  );
}

// Helper component for setting groups
function SettingGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      {children}
    </div>
  );
}
