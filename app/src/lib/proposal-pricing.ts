import type { ProposalElement } from '@/types/proposal';

export interface PricingResult {
  subtotal: number;
  lineItems: Array<{
    label: string;
    quantity?: number;
    unitPrice?: number;
    total: number;
  }>;
  taxAmount?: number;
  discountAmount?: number;
  total: number;
}

/**
 * Calculate proposal pricing based on form values
 *
 * Supports multiple pricing models:
 * - Tiered by quantity (number_input + pricing_tiers)
 * - Service toggles (fixed prices)
 * - Dropdown/radio with price modifiers
 * - Package selection
 */
export function calculateProposalPricing(
  elements: ProposalElement[],
  formValues: Record<string, any>
): PricingResult {
  const lineItems: PricingResult['lineItems'] = [];
  let subtotal = 0;

  // 1. Process number inputs with pricing tiers
  elements.forEach((element) => {
    if (element.type === 'number_input' && element.config.pricingVariable) {
      const quantity = formValues[element.config.pricingVariable];

      if (!quantity || quantity <= 0) return;

      // Find associated pricing_tiers element
      const tierElement = elements.find(
        (el) =>
          el.type === 'pricing_tiers' &&
          el.config.basedOn === element.config.pricingVariable
      );

      if (tierElement && tierElement.config.tiers) {
        const tier = findMatchingTier(tierElement.config.tiers, quantity);
        if (tier) {
          const total = quantity * tier.pricePerUnit;
          lineItems.push({
            label: element.config.label,
            quantity,
            unitPrice: tier.pricePerUnit,
            total,
          });
          subtotal += total;
        }
      } else {
        // No tier pricing - just use quantity if there's a base price in config
        if (element.config.basePrice) {
          const total = quantity * element.config.basePrice;
          lineItems.push({
            label: element.config.label,
            quantity,
            unitPrice: element.config.basePrice,
            total,
          });
          subtotal += total;
        }
      }
    }

    // 2. Process service toggles
    if (element.type === 'service_toggles') {
      element.config.services?.forEach((service: any) => {
        const isSelected = formValues.services?.[service.id];
        if (isSelected) {
          lineItems.push({
            label: service.name,
            total: service.basePrice,
          });
          subtotal += service.basePrice;
        }
      });
    }

    // 3. Process dropdown/radio with price modifiers
    if (element.type === 'dropdown' || element.type === 'radio_group') {
      const selectedValue = formValues[element.id];
      if (selectedValue) {
        const selectedOption = element.config.options?.find(
          (opt: any) => opt.value === selectedValue
        );
        if (selectedOption?.priceModifier) {
          lineItems.push({
            label: `${element.config.label}: ${selectedOption.label}`,
            total: selectedOption.priceModifier,
          });
          subtotal += selectedOption.priceModifier;
        }
      }
    }

    // 4. Process package tiers
    if (element.type === 'package_tiers') {
      element.config.packages?.forEach((pkg: any) => {
        const isSelected = formValues[`package.${pkg.id}`];
        if (isSelected) {
          lineItems.push({
            label: pkg.name,
            total: pkg.price,
          });
          subtotal += pkg.price;
        }
      });
    }

    // 5. Process checkbox group with price modifiers
    if (element.type === 'checkbox_group') {
      element.config.options?.forEach((option: any) => {
        const isSelected = formValues[`${element.id}.${option.value}`];
        if (isSelected && option.priceModifier) {
          lineItems.push({
            label: `${element.config.label}: ${option.label}`,
            total: option.priceModifier,
          });
          subtotal += option.priceModifier;
        }
      });
    }
  });

  // Calculate tax
  const pricingSummary = elements.find((el) => el.type === 'pricing_summary');
  let taxAmount = 0;
  if (pricingSummary?.config.showTax && pricingSummary.config.taxRate) {
    taxAmount = subtotal * pricingSummary.config.taxRate;
  }

  // Calculate discount (if any)
  const discountAmount = 0; // TODO: Implement discount logic if needed

  const total = subtotal + taxAmount - discountAmount;

  return {
    subtotal,
    lineItems,
    taxAmount,
    discountAmount,
    total,
  };
}

/**
 * Find matching pricing tier for a given quantity
 */
function findMatchingTier(
  tiers: Array<{ minQty: number; maxQty: number | null; pricePerUnit: number }>,
  quantity: number
) {
  return tiers.find((tier) => {
    if (quantity < tier.minQty) return false;
    if (tier.maxQty === null) return true; // Infinity
    return quantity <= tier.maxQty;
  });
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toFixed(2)}`;
}
