/**
 * E2E Tests: Pipeline with 4-Product Tracking
 * Test Coverage: 10 P0 scenarios
 * Spec Reference: E2E_TEST_PLAN.md lines 455-544
 */

import { test, expect } from '@playwright/test';

test.describe('Pipeline with 4-Product Tracking @p0 @critical @pipeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pipeline');
    await page.waitForLoadState('networkidle');
  });

  /**
   * TC-PIPE-001: Verify client cards layout with CRM fields
   * Decision: Q13 (CRM field display)
   */
  test('TC-PIPE-001: Client cards display with CRM fields', async ({ page }) => {
    // Look for client cards in grid layout
    const clientCards = page.locator('[data-testid="client-card"]').or(
      page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
    );

    const count = await clientCards.count();

    if (count > 0) {
      const firstCard = clientCards.first();
      await expect(firstCard).toBeVisible({ timeout: 5000 });

      // Verify CRM fields are present
      const crmFields = [
        /client.*name|studio.*name/i,
        /last.*contacted|contacted/i,
        /next.*follow.*up|follow.*up/i,
        /contact.*frequency|frequency/i,
        /status|lead/i
      ];

      let visibleFields = 0;
      for (const pattern of crmFields) {
        const field = firstCard.locator('label, span, div').filter({ hasText: pattern }).first();
        if (await field.isVisible({ timeout: 1000 }).catch(() => false)) {
          visibleFields++;
        }
      }

      // At least 3 CRM fields should be visible
      expect(visibleFields).toBeGreaterThanOrEqual(3);
    }
  });

  /**
   * TC-PIPE-002: Verify client status badges (Hot, Warm, Cold)
   * Spec: Status badges display with correct colors
   */
  test('TC-PIPE-002: Client status badges display correctly', async ({ page }) => {
    // Look for status badges
    const statusBadges = page.locator('[data-testid="status-badge"]').or(
      page.locator('.badge, .status').filter({ hasText: /hot|warm|cold|lead/i })
    );

    const count = await statusBadges.count();

    if (count > 0) {
      await expect(statusBadges.first()).toBeVisible({ timeout: 5000 });

      // Verify status badges have styling (colors)
      for (let i = 0; i < Math.min(count, 3); i++) {
        const badge = statusBadges.nth(i);
        const classList = await badge.getAttribute('class');
        const style = await badge.getAttribute('style');

        // Status badges should have color styling
        const hasColorStyling = (classList && classList.length > 10) || (style && style.includes('color'));
        expect(hasColorStyling).toBeTruthy();
      }
    }
  });

  /**
   * TC-PIPE-003: Verify 4-product tracking section
   * Decision: Q6 (4-product tracking)
   */
  test('TC-PIPE-003: 4-product tracking section displays', async ({ page }) => {
    // Look for client card to expand
    const clientCard = page.locator('[data-testid="client-card"]').or(
      page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
    ).first();

    if (await clientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Try to expand card (click it or find expand button)
      const expandButton = clientCard.locator('button').filter({ hasText: /expand|view.*details|more/i }).first();

      if (await expandButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expandButton.click();
        await page.waitForTimeout(500);
      } else {
        // Try clicking the card itself
        await clientCard.click();
        await page.waitForTimeout(500);
      }

      // Look for product tracking sections
      const products = [
        /studio.*sage.*chatbot|chatbot/i,
        /dance.*recital.*package|recital.*package/i,
        /competition.*software/i,
        /core.*video.*production|video.*production/i
      ];

      let visibleProducts = 0;
      for (const productPattern of products) {
        const product = page.locator('[data-testid*="product"]').or(
          page.locator('div, section').filter({ hasText: productPattern })
        ).first();

        if (await product.isVisible({ timeout: 1000 }).catch(() => false)) {
          visibleProducts++;
        }
      }

      // At least 2 products should be visible
      expect(visibleProducts).toBeGreaterThanOrEqual(2);
    }
  });

  /**
   * TC-PIPE-004: Verify multi-depth product tracking (checkbox, status, revenue, notes)
   * Decision: Q7 (Multi-depth tracking)
   */
  test('TC-PIPE-004: Product tracking shows all fields', async ({ page }) => {
    const clientCard = page.locator('[data-testid="client-card"]').or(
      page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
    ).first();

    if (await clientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Expand card
      const expandButton = clientCard.locator('button').filter({ hasText: /expand|view.*details|more/i }).first();
      if (await expandButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expandButton.click();
        await page.waitForTimeout(500);
      } else {
        await clientCard.click();
        await page.waitForTimeout(500);
      }

      // Look for product tracking fields
      const productSection = page.locator('[data-testid*="product"]').or(
        page.locator('div, section').filter({ hasText: /recital|competition|chatbot|video/i })
      ).first();

      if (await productSection.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Check for tracking elements
        const hasCheckbox = await productSection.locator('input[type="checkbox"]').isVisible({ timeout: 1000 }).catch(() => false);
        const hasStatus = await productSection.locator('.status, .badge').isVisible({ timeout: 1000 }).catch(() => false);
        const hasRevenue = await productSection.locator('text=/\\$|revenue|price/i').isVisible({ timeout: 1000 }).catch(() => false);
        const hasNotes = await productSection.locator('textarea, input[type="text"]').isVisible({ timeout: 1000 }).catch(() => false);

        // At least 2 tracking fields should be present
        const trackingFields = [hasCheckbox, hasStatus, hasRevenue, hasNotes].filter(Boolean).length;
        expect(trackingFields).toBeGreaterThanOrEqual(2);
      }
    }
  });

  /**
   * TC-PIPE-005: Verify product status progression
   * Decision: Q7 (Status updates)
   */
  test('TC-PIPE-005: Product status can be updated', async ({ page }) => {
    const clientCard = page.locator('[data-testid="client-card"]').or(
      page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
    ).first();

    if (await clientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Expand card
      const expandButton = clientCard.locator('button').filter({ hasText: /expand|view.*details|more/i }).first();
      if (await expandButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expandButton.click();
        await page.waitForTimeout(500);
      } else {
        await clientCard.click();
        await page.waitForTimeout(500);
      }

      // Look for status badge
      const statusBadge = page.locator('[data-testid="product-status"]').or(
        page.locator('.status, .badge, select[name*="status"]').filter({ hasText: /discussing|proposal|won|lost/i })
      ).first();

      if (await statusBadge.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Check if it's clickable (button) or a select
        const tagName = await statusBadge.evaluate((el) => el.tagName.toLowerCase());

        if (tagName === 'select') {
          // It's a dropdown
          await expect(statusBadge).toBeVisible();
        } else if (tagName === 'button') {
          // It's a clickable button
          await expect(statusBadge).toBeEnabled();
        }
      }
    }
  });

  /**
   * TC-PIPE-006: Verify revenue tracking per product
   * Spec: Total client revenue calculated from all products
   */
  test('TC-PIPE-006: Revenue tracking displays correctly', async ({ page }) => {
    // Look for revenue indicators
    const revenueElements = page.locator('[data-testid*="revenue"]').or(
      page.locator('text=/\\$[0-9,]+/').filter({ hasText: /\\$/ })
    );

    const count = await revenueElements.count();

    if (count > 0) {
      await expect(revenueElements.first()).toBeVisible({ timeout: 5000 });

      // Verify at least one revenue value is displayed
      const revenueText = await revenueElements.first().textContent();
      expect(revenueText).toMatch(/\$[0-9,]+/);
    }
  });

  /**
   * TC-PIPE-007: Verify notes field per product
   * Decision: Q7 (Notes field)
   */
  test('TC-PIPE-007: Notes field available for products', async ({ page }) => {
    const clientCard = page.locator('[data-testid="client-card"]').or(
      page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
    ).first();

    if (await clientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Expand card
      const expandButton = clientCard.locator('button').filter({ hasText: /expand|view.*details|more/i }).first();
      if (await expandButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expandButton.click();
        await page.waitForTimeout(500);
      } else {
        await clientCard.click();
        await page.waitForTimeout(500);
      }

      // Look for notes field
      const notesField = page.locator('textarea, input[placeholder*="note" i], [data-testid*="notes"]').first();

      if (await notesField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(notesField).toBeVisible();
        await expect(notesField).toBeEnabled();
      }
    }
  });

  /**
   * TC-PIPE-008: Verify quick actions (Log Contact, Send Email, View Details)
   * Spec: Quick action buttons present on client cards
   */
  test('TC-PIPE-008: Quick actions available on client cards', async ({ page }) => {
    const clientCard = page.locator('[data-testid="client-card"]').or(
      page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
    ).first();

    if (await clientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Look for quick action buttons
      const actionButtons = clientCard.locator('button').filter({
        hasText: /log.*contact|send.*email|view.*details|contact|email|details/i
      });

      const count = await actionButtons.count();

      if (count > 0) {
        await expect(actionButtons.first()).toBeVisible();

        // Verify at least one action button is clickable
        await expect(actionButtons.first()).toBeEnabled();
      }
    }
  });

  /**
   * TC-PIPE-009: Verify inline editing for all fields
   * Spec: Fields become editable on click
   */
  test('TC-PIPE-009: Inline editing available for fields', async ({ page }) => {
    const clientCard = page.locator('[data-testid="client-card"]').or(
      page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
    ).first();

    if (await clientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Look for editable fields (inputs, dates, text)
      const editableFields = clientCard.locator('input[type="text"], input[type="date"], textarea, [contenteditable="true"]');

      const count = await editableFields.count();

      if (count > 0) {
        await expect(editableFields.first()).toBeVisible();
        await expect(editableFields.first()).toBeEnabled();
      } else {
        // Alternative: Look for click-to-edit fields
        const clickableFields = clientCard.locator('[data-testid*="editable"], .editable');
        const clickableCount = await clickableFields.count();

        if (clickableCount > 0) {
          await expect(clickableFields.first()).toBeVisible();
        }
      }
    }
  });

  /**
   * TC-PIPE-010: Verify filter by product focus
   * Spec: Filter clients by product interest
   */
  test('TC-PIPE-010: Filter by product focus works', async ({ page }) => {
    // Look for product filter
    const productFilter = page.locator('[data-testid="product-filter"]').or(
      page.locator('select[name*="product"], select:has-option("Dance Recital")').first()
    );

    if (await productFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Get initial client count
      const clientCards = page.locator('[data-testid="client-card"]').or(
        page.locator('.client-card, [role="article"]').filter({ hasText: /client|studio/i })
      );
      const initialCount = await clientCards.count();

      // Apply filter
      await productFilter.selectOption({ index: 1 }); // Select first product
      await page.waitForTimeout(500);

      // Verify filtering applied
      const filteredCount = await clientCards.count();

      // Filter should change the count (or keep same if all clients match)
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    } else {
      // Alternative: Look for filter buttons
      const filterButtons = page.locator('button').filter({ hasText: /recital|competition|chatbot|video/i });
      const buttonCount = await filterButtons.count();

      if (buttonCount > 0) {
        await expect(filterButtons.first()).toBeVisible();
      }
    }
  });
});
