/**
 * Proposal Builder Type Definitions
 *
 * Types for the proposal builder elements and configurations
 */

export type ElementType =
  | 'hero'
  | 'rich_text'
  | 'image'
  | 'video'
  | 'number_input'
  | 'text_input'
  | 'textarea'
  | 'date_picker'
  | 'dropdown'
  | 'service_toggles'
  | 'checkbox_group'
  | 'radio_group'
  | 'pricing_tiers'
  | 'package_tiers'
  | 'pricing_summary'
  | 'submit_button'
  | 'divider';

export interface ProposalElement {
  id: string;
  type: ElementType;
  order: number;
  config: Record<string, any>;
}

// Element-specific config types

export interface HeroConfig {
  title: string;
  subtitle: string;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
}

export interface NumberInputConfig {
  label: string;
  placeholder: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  helpText?: string;
  required: boolean;
  pricingVariable?: string;
}

export interface ServiceTogglesConfig {
  label: string;
  services: Array<{
    id: string;
    name: string;
    description: string;
    basePrice: number;
    icon?: string;
    defaultEnabled: boolean;
  }>;
  layout: 'list' | 'grid';
  allowMultiple: boolean;
}

export interface PricingSummaryConfig {
  label: string;
  showBreakdown: boolean;
  showTax: boolean;
  taxRate?: number;
  showDiscount: boolean;
  currencySymbol: string;
  position: 'inline' | 'sticky';
}

export interface SubmitButtonConfig {
  label: string;
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  fullWidth: boolean;
  successMessage: string;
  redirectUrl?: string;
}

// Element metadata for palette
export interface ElementMetadata {
  type: ElementType;
  label: string;
  icon: string;
  category: 'content' | 'inputs' | 'selections' | 'pricing' | 'actions';
  description?: string;
}

export const ELEMENT_CATEGORIES = {
  content: 'Content',
  inputs: 'Inputs',
  selections: 'Selections',
  pricing: 'Pricing',
  actions: 'Actions',
} as const;

export const ELEMENT_METADATA: ElementMetadata[] = [
  // Content Elements
  {
    type: 'hero',
    label: 'Hero Section',
    icon: '🎯',
    category: 'content',
    description: 'Header with title and subtitle',
  },
  {
    type: 'rich_text',
    label: 'Rich Text',
    icon: '📝',
    category: 'content',
    description: 'Formatted text content',
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    category: 'content',
    description: 'Standalone image',
  },
  {
    type: 'video',
    label: 'Video',
    icon: '🎥',
    category: 'content',
    description: 'Embedded video',
  },

  // Input Elements
  {
    type: 'number_input',
    label: 'Number Input',
    icon: '🔢',
    category: 'inputs',
    description: 'Quantity selector',
  },
  {
    type: 'text_input',
    label: 'Text Input',
    icon: '✏️',
    category: 'inputs',
    description: 'Short text field',
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: '📄',
    category: 'inputs',
    description: 'Long text field',
  },
  {
    type: 'date_picker',
    label: 'Date Picker',
    icon: '📅',
    category: 'inputs',
    description: 'Date selection',
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: '▼',
    category: 'inputs',
    description: 'Single choice dropdown',
  },

  // Selection Elements
  {
    type: 'service_toggles',
    label: 'Service Toggles',
    icon: '☑️',
    category: 'selections',
    description: 'Enable/disable services',
  },
  {
    type: 'checkbox_group',
    label: 'Checkbox Group',
    icon: '☐',
    category: 'selections',
    description: 'Multi-select checkboxes',
  },
  {
    type: 'radio_group',
    label: 'Radio Group',
    icon: '◉',
    category: 'selections',
    description: 'Single-select radios',
  },

  // Pricing Elements
  {
    type: 'pricing_tiers',
    label: 'Pricing Tiers',
    icon: '💰',
    category: 'pricing',
    description: 'Tiered pricing based on quantity',
  },
  {
    type: 'package_tiers',
    label: 'Package Tiers',
    icon: '📦',
    category: 'pricing',
    description: 'Predefined packages',
  },
  {
    type: 'pricing_summary',
    label: 'Pricing Summary',
    icon: '🧾',
    category: 'pricing',
    description: 'Live-updating total',
  },

  // Action Elements
  {
    type: 'submit_button',
    label: 'Submit Button',
    icon: '✉️',
    category: 'actions',
    description: 'Submit proposal form',
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '—',
    category: 'actions',
    description: 'Visual separator',
  },
];
