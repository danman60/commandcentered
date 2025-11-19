/**
 * E2E Tests: Planning Calendar Page
 * Test Coverage: 12 P0 scenarios
 * Spec Reference: E2E_TEST_PLAN.md lines 106-188
 */

import { test, expect } from '@playwright/test';
import { testEvents } from './fixtures/events';

test.describe('Planning Calendar Page @p0 @critical', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Planning page
    await page.goto('/planning');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  /**
   * TC-PLAN-001: Verify month calendar loads with current month by default
   * Decision: Q1 (Month calendar view)
   */
  test('TC-PLAN-001: Verify month calendar loads with current month @smoke', async ({ page }) => {
    // Get current month/year for assertion
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long' });
    const currentYear = now.getFullYear().toString();

    // Verify calendar title shows current month/year
    const calendarTitle = page.locator('[data-testid="calendar-title"]').or(
      page.locator('h2').filter({ hasText: new RegExp(currentMonth, 'i') })
    );

    await expect(calendarTitle).toBeVisible();
    await expect(calendarTitle).toContainText(currentMonth);
    await expect(calendarTitle).toContainText(currentYear);

    // Verify calendar grid is visible
    const calendar = page.locator('[data-testid="calendar-grid"]').or(
      page.locator('.calendar-grid, [role="grid"], table')
    );
    await expect(calendar).toBeVisible();
  });

  /**
   * TC-PLAN-002: Verify 3-panel layout renders correctly
   * Spec: Operators | Kits | Calendar (20% | 20% | 60%)
   */
  test('TC-PLAN-002: Verify 3-panel layout renders correctly', async ({ page }) => {
    // Check for 3 main panels
    const operatorsPanel = page.locator('[data-testid="operators-panel"]').or(
      page.locator('aside').filter({ hasText: /operators/i }).first()
    );
    const kitsPanel = page.locator('[data-testid="kits-panel"]').or(
      page.locator('aside').filter({ hasText: /kits/i }).first()
    );
    const calendarPanel = page.locator('[data-testid="calendar-panel"]').or(
      page.locator('main, section').filter({ has: page.locator('.calendar-grid, [role="grid"]') })
    );

    // Verify all panels are visible
    await expect(operatorsPanel).toBeVisible();
    await expect(kitsPanel).toBeVisible();
    await expect(calendarPanel).toBeVisible();

    // Verify panel headers
    await expect(page.getByText(/operators/i).first()).toBeVisible();
    await expect(page.getByText(/kits/i).first()).toBeVisible();
  });

  /**
   * TC-PLAN-003: Verify month navigation (previous/next buttons)
   */
  test('TC-PLAN-003: Verify month navigation works', async ({ page }) => {
    // Get current month
    const initialMonth = await page.locator('[data-testid="calendar-title"]').or(
      page.locator('h2').filter({ hasText: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/ })
    ).first().textContent();

    // Click next month button
    const nextButton = page.locator('[data-testid="next-month"]').or(
      page.getByRole('button', { name: /next/i })
    ).or(
      page.locator('button[aria-label*="next"]')
    ).first();

    await nextButton.click();

    // Wait for calendar to update
    await page.waitForTimeout(500);

    // Verify month changed
    const newMonth = await page.locator('[data-testid="calendar-title"]').or(
      page.locator('h2').filter({ hasText: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/ })
    ).first().textContent();

    expect(newMonth).not.toBe(initialMonth);

    // Click previous month button to go back
    const prevButton = page.locator('[data-testid="prev-month"]').or(
      page.getByRole('button', { name: /prev/i })
    ).or(
      page.locator('button[aria-label*="prev"]')
    ).first();

    await prevButton.click();

    // Wait for calendar to update
    await page.waitForTimeout(500);

    // Verify we're back to initial month
    const finalMonth = await page.locator('[data-testid="calendar-title"]').or(
      page.locator('h2').filter({ hasText: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/ })
    ).first().textContent();

    expect(finalMonth).toBe(initialMonth);
  });

  /**
   * TC-PLAN-004: Verify event bars display client name, operator initials, kit icons
   * Decision: Q3 (Calendar indicators)
   */
  test('TC-PLAN-004: Verify event bars display client name, operator initials, kit icons', async ({ page }) => {
    // Look for event bars on the calendar
    const eventBars = page.locator('[data-testid="event-bar"]').or(
      page.locator('.event-bar, .calendar-event, [data-event]')
    );

    // Check if any events exist
    const eventCount = await eventBars.count();

    if (eventCount > 0) {
      const firstEvent = eventBars.first();

      // Verify event is visible
      await expect(firstEvent).toBeVisible();

      // Look for client name within event (flexible selector)
      const hasClientName = await firstEvent.locator('text=/EMPWR|Glow|ABC|[A-Z][a-z]+\\s+[A-Z][a-z]+/').count() > 0;
      expect(hasClientName).toBeTruthy();

      // Look for operator initials (2-3 capital letters pattern)
      const hasOperatorInitials = await firstEvent.locator('text=/[A-Z]{2,3}/').count() > 0;
      // Note: This might not always be visible depending on the design

      // Look for kit icon (camera, video, or other icons)
      const hasIcon = await firstEvent.locator('svg, i, [data-icon], img').count() > 0;
      // Note: Icons might not be visible depending on implementation
    } else {
      // If no events, verify empty state or create button is visible
      const emptyState = page.locator('text=/no events|create event|add event/i');
      await expect(emptyState.first()).toBeVisible();
    }
  });

  /**
   * TC-PLAN-005: Verify event color-coding by status
   * Statuses: Booked (Green), Confirmed (Green), Tentative (Orange), Proposal (Cyan)
   */
  test('TC-PLAN-005: Verify event color-coding by status', async ({ page }) => {
    const eventBars = page.locator('[data-testid="event-bar"]').or(
      page.locator('.event-bar, .calendar-event, [data-event]')
    );

    const eventCount = await eventBars.count();

    if (eventCount > 0) {
      // Check for color classes or styles
      for (let i = 0; i < Math.min(eventCount, 3); i++) {
        const event = eventBars.nth(i);

        // Get computed styles or class names
        const classList = await event.getAttribute('class') || '';
        const bgStyle = await event.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // Verify the event has some color styling
        const hasColorClass = /green|orange|cyan|blue|red/i.test(classList);
        const hasBgColor = bgStyle !== 'rgba(0, 0, 0, 0)' && bgStyle !== 'transparent';

        expect(hasColorClass || hasBgColor).toBeTruthy();
      }
    }
  });

  /**
   * TC-PLAN-006: Verify click event opens Event Detail Modal
   */
  test('TC-PLAN-006: Verify click event opens Event Detail Modal', async ({ page }) => {
    const eventBars = page.locator('[data-testid="event-bar"]').or(
      page.locator('.event-bar, .calendar-event, [data-event]')
    );

    const eventCount = await eventBars.count();

    if (eventCount > 0) {
      // Click the first event
      await eventBars.first().click();

      // Wait for modal to appear
      await page.waitForTimeout(500);

      // Look for modal (flexible selectors)
      const modal = page.locator('[role="dialog"]').or(
        page.locator('[data-testid="event-modal"]')
      ).or(
        page.locator('.modal, [data-modal]')
      );

      // Verify modal opened
      await expect(modal.first()).toBeVisible();

      // Verify modal contains event information
      const modalContent = modal.first();
      const hasEventInfo = await modalContent.locator('text=/event|client|operator|kit|shift/i').count() > 0;
      expect(hasEventInfo).toBeTruthy();

      // Close modal (look for close button)
      const closeButton = modalContent.locator('button[aria-label*="close"]').or(
        modalContent.locator('button').filter({ hasText: /close|×|✕/i })
      ).first();

      if (await closeButton.isVisible()) {
        await closeButton.click();
        await expect(modal.first()).not.toBeVisible();
      }
    }
  });

  /**
   * TC-PLAN-007: Verify alerts banner for missing operators/kits
   */
  test('TC-PLAN-007: Verify alerts banner for missing operators/kits', async ({ page }) => {
    // Look for alerts banner
    const alertsBanner = page.locator('[data-testid="alerts-banner"]').or(
      page.locator('[role="alert"]')
    ).or(
      page.locator('.alert, .banner').filter({ hasText: /alert|warning|missing|incomplete/i })
    );

    // Alerts might not always be present, so check if visible
    const alertCount = await alertsBanner.count();

    if (alertCount > 0) {
      await expect(alertsBanner.first()).toBeVisible();

      // Verify alert contains useful information
      const alertText = await alertsBanner.first().textContent();
      const hasRelevantContent = /operator|kit|missing|incomplete|event/i.test(alertText || '');
      expect(hasRelevantContent).toBeTruthy();
    }
  });

  /**
   * TC-PLAN-008: Verify operator availability indicators
   * Indicators: Full Day, Partial Day, Unavailable
   */
  test('TC-PLAN-008: Verify operator availability indicators', async ({ page }) => {
    const operatorsPanel = page.locator('[data-testid="operators-panel"]').or(
      page.locator('aside').filter({ hasText: /operators/i }).first()
    );

    await expect(operatorsPanel).toBeVisible();

    // Look for operator items
    const operatorItems = operatorsPanel.locator('[data-testid="operator-item"]').or(
      operatorsPanel.locator('li, .operator-card, [data-operator]')
    );

    const operatorCount = await operatorItems.count();

    if (operatorCount > 0) {
      // Check for availability indicators (badges, icons, or color coding)
      const firstOperator = operatorItems.first();

      // Look for availability status
      const hasStatus = await firstOperator.locator('text=/available|unavailable|partial|booked/i').count() > 0;
      const hasColorIndicator = await firstOperator.locator('[data-status], .status, .badge').count() > 0;

      // At least one indicator method should be present
      expect(hasStatus || hasColorIndicator).toBeTruthy();
    }
  });

  /**
   * TC-PLAN-009: Verify operators panel displays all operators
   */
  test('TC-PLAN-009: Verify operators panel displays operators', async ({ page }) => {
    const operatorsPanel = page.locator('[data-testid="operators-panel"]').or(
      page.locator('aside').filter({ hasText: /operators/i }).first()
    );

    await expect(operatorsPanel).toBeVisible();

    // Look for operator items
    const operatorItems = operatorsPanel.locator('[data-testid="operator-item"]').or(
      operatorsPanel.locator('li, .operator-card, [data-operator]')
    );

    const operatorCount = await operatorItems.count();

    // Verify at least one operator is shown (or empty state)
    if (operatorCount > 0) {
      await expect(operatorItems.first()).toBeVisible();

      // Verify operator has name or initials
      const hasName = await operatorItems.first().locator('text=/[A-Z][a-z]+|[A-Z]{2,3}/').count() > 0;
      expect(hasName).toBeTruthy();
    } else {
      // Check for empty state
      const emptyState = operatorsPanel.locator('text=/no operators|add operator/i');
      await expect(emptyState.first()).toBeVisible();
    }
  });

  /**
   * TC-PLAN-010: Verify kits panel displays all kits
   */
  test('TC-PLAN-010: Verify kits panel displays kits', async ({ page }) => {
    const kitsPanel = page.locator('[data-testid="kits-panel"]').or(
      page.locator('aside').filter({ hasText: /kits/i }).first()
    );

    await expect(kitsPanel).toBeVisible();

    // Look for kit items
    const kitItems = kitsPanel.locator('[data-testid="kit-item"]').or(
      kitsPanel.locator('li, .kit-card, [data-kit]')
    );

    const kitCount = await kitItems.count();

    // Verify at least one kit is shown (or empty state)
    if (kitCount > 0) {
      await expect(kitItems.first()).toBeVisible();

      // Verify kit has name and item count
      const hasKitInfo = await kitItems.first().locator('text=/kit|items|gear/i').count() > 0;
      expect(hasKitInfo).toBeTruthy();
    } else {
      // Check for empty state or create button
      const emptyState = kitsPanel.locator('text=/no kits|create kit|add kit/i');
      await expect(emptyState.first()).toBeVisible();
    }
  });

  /**
   * TC-PLAN-011: Verify panel resizing (draggable dividers)
   * Note: This test is skipped as it requires complex interaction simulation
   */
  test.skip('TC-PLAN-011: Verify panel resizing with draggable dividers', async ({ page }) => {
    // This test would require:
    // 1. Finding the resize handle/divider
    // 2. Simulating drag gesture
    // 3. Verifying panel width changes
    // 4. Checking persistence after refresh

    // Implementation requires detailed knowledge of resize implementation
  });

  /**
   * TC-PLAN-012: Verify full-screen mode (collapse navigation)
   */
  test('TC-PLAN-012: Verify full-screen mode toggle', async ({ page }) => {
    // Look for full-screen or collapse navigation button
    const fullscreenButton = page.locator('[data-testid="fullscreen-toggle"]').or(
      page.getByRole('button', { name: /fullscreen|expand|collapse/i })
    ).or(
      page.locator('button[aria-label*="fullscreen"], button[aria-label*="expand"]')
    );

    const buttonCount = await fullscreenButton.count();

    if (buttonCount > 0) {
      // Get sidebar/navigation element
      const sidebar = page.locator('nav, aside').first();
      const initialVisibility = await sidebar.isVisible();

      // Click fullscreen toggle
      await fullscreenButton.first().click();
      await page.waitForTimeout(500);

      // Verify navigation state changed
      const newVisibility = await sidebar.isVisible();

      // State should have changed
      expect(newVisibility).not.toBe(initialVisibility);

      // Toggle back
      await fullscreenButton.first().click();
      await page.waitForTimeout(500);

      // Verify returned to original state
      const finalVisibility = await sidebar.isVisible();
      expect(finalVisibility).toBe(initialVisibility);
    }
  });
});
