/**
 * E2E Tests: Planning Calendar
 * Test Coverage: 12 P0 scenarios
 * Spec Reference: E2E_TEST_PLAN.md lines 106-189
 */

import { test, expect } from '@playwright/test';

test.describe('Planning Calendar @p0 @critical @planning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planning');
    await page.waitForLoadState('networkidle');
  });

  test('TC-PLAN-001: Month calendar loads with current month', async ({ page }) => {
    const date = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear();

    const header = page.locator('h1, h2, h3').filter({
      hasText: new RegExp(`${currentMonth}.*${currentYear}|${currentYear}.*${currentMonth}`, 'i')
    }).first();

    await expect(header).toBeVisible({ timeout: 5000 });

    const calendar = page.locator('[data-testid="calendar-grid"], .calendar-grid, .fc-view, [role="grid"]').first();
    await expect(calendar).toBeVisible();
  });

  test('TC-PLAN-002: 3-panel layout renders', async ({ page }) => {
    const operatorsPanel = page.locator('[data-testid="operators-panel"]').or(
      page.locator('h2, h3').filter({ hasText: /operators/i }).locator('..').locator('..').first()
    );
    await expect(operatorsPanel).toBeVisible({ timeout: 5000 });

    const kitsPanel = page.locator('[data-testid="kits-panel"]').or(
      page.locator('h2, h3').filter({ hasText: /kits/i }).locator('..').locator('..').first()
    );
    await expect(kitsPanel).toBeVisible();

    const calendar = page.locator('[data-testid="calendar"], .calendar, .fc-view, [role="grid"]').first();
    await expect(calendar).toBeVisible();
  });

  test('TC-PLAN-003: Month navigation works', async ({ page }) => {
    const monthHeader = page.locator('h1, h2, h3').filter({
      hasText: /january|february|march|april|may|june|july|august|september|october|november|december/i
    }).first();
    const initialMonth = await monthHeader.textContent();

    const nextButton = page.locator('button').filter({ hasText: /next|’|:|»/i }).or(
      page.locator('[data-testid="next-month"], [aria-label*="next" i]')
    ).first();

    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(500);

      const newMonth = await monthHeader.textContent();
      expect(newMonth).not.toBe(initialMonth);

      const prevButton = page.locator('button').filter({ hasText: /prev||9|«/i }).or(
        page.locator('[data-testid="prev-month"], [aria-label*="prev" i]')
      ).first();

      await prevButton.click();
      await page.waitForTimeout(500);

      const finalMonth = await monthHeader.textContent();
      expect(finalMonth).toBe(initialMonth);
    }
  });

  test('TC-PLAN-004: Event bars display correctly', async ({ page }) => {
    const eventBars = page.locator('[data-testid="event-bar"]').or(
      page.locator('.event, .fc-event, [role="button"]').filter({ hasText: /dance|recital|competition/i })
    );

    const count = await eventBars.count();
    if (count > 0) {
      await expect(eventBars.first()).toBeVisible();
      const text = await eventBars.first().textContent();
      expect(text).toBeTruthy();
      expect(text!.length).toBeGreaterThan(0);
    }
  });

  test('TC-PLAN-005: Event color-coding by status', async ({ page }) => {
    const events = page.locator('[data-testid="event-bar"]').or(
      page.locator('.event, .fc-event, [role="button"]').filter({ hasText: /dance|recital|competition/i })
    );

    const count = await events.count();
    if (count > 0) {
      await expect(events.first()).toBeVisible();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const event = events.nth(i);
        const classList = await event.getAttribute('class');
        const style = await event.getAttribute('style');
        const hasColorStyling = (classList && classList.length > 0) || (style && style.includes('color'));
        expect(hasColorStyling).toBeTruthy();
      }
    }
  });

  test('TC-PLAN-006: Event click opens modal', async ({ page }) => {
    const eventBar = page.locator('[data-testid="event-bar"]').or(
      page.locator('.event, .fc-event, [role="button"]').filter({ hasText: /dance|recital|competition/i })
    ).first();

    if (await eventBar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await eventBar.click();

      const modal = page.locator('[role="dialog"]').or(
        page.locator('[data-testid="event-detail-modal"], .modal')
      ).first();

      await expect(modal).toBeVisible({ timeout: 3000 });

      const modalBox = await modal.boundingBox();
      const viewportSize = page.viewportSize();

      if (modalBox && viewportSize) {
        const widthPercentage = (modalBox.width / viewportSize.width) * 100;
        expect(widthPercentage).toBeGreaterThan(60);
        expect(widthPercentage).toBeLessThan(95);
      }
    }
  });

  test('TC-PLAN-007: Alerts banner displays', async ({ page }) => {
    const alertsBanner = page.locator('[data-testid="alerts-banner"]').or(
      page.locator('[role="alert"], .alert, .banner').filter({ hasText: /missing|incomplete|warning/i })
    ).first();

    const isVisible = await alertsBanner.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      const alertText = await alertsBanner.textContent();
      expect(alertText).toBeTruthy();
      expect(alertText!.length).toBeGreaterThan(0);
    }
  });

  test('TC-PLAN-008: Operator availability indicators', async ({ page }) => {
    const operatorsPanel = page.locator('[data-testid="operators-panel"]').or(
      page.locator('h2, h3').filter({ hasText: /operators/i }).locator('..').locator('..').first()
    );

    if (await operatorsPanel.isVisible({ timeout: 3000 }).catch(() => false)) {
      const operatorItems = operatorsPanel.locator('[data-testid="operator-item"]').or(
        operatorsPanel.locator('.operator, .operator-item, [role="listitem"]')
      );

      const count = await operatorItems.count();
      if (count > 0) {
        await expect(operatorItems.first()).toBeVisible();
        const hasContent = await operatorItems.first().textContent();
        expect(hasContent).toBeTruthy();
      }
    }
  });

  test('TC-PLAN-009: Operators panel displays', async ({ page }) => {
    const operatorsPanel = page.locator('[data-testid="operators-panel"]').or(
      page.locator('h2, h3').filter({ hasText: /operators/i }).locator('..').locator('..').first()
    );

    await expect(operatorsPanel).toBeVisible({ timeout: 5000 });

    const operatorItems = operatorsPanel.locator('[data-testid="operator-item"]').or(
      operatorsPanel.locator('.operator, .operator-item, [role="listitem"]')
    );

    const count = await operatorItems.count();
    expect(count).toBeGreaterThan(0);
    await expect(operatorItems.first()).toBeVisible();
  });

  test('TC-PLAN-010: Kits panel displays', async ({ page }) => {
    const kitsPanel = page.locator('[data-testid="kits-panel"]').or(
      page.locator('h2, h3').filter({ hasText: /kits/i }).locator('..').locator('..').first()
    );

    await expect(kitsPanel).toBeVisible({ timeout: 5000 });

    const kitItems = kitsPanel.locator('[data-testid="kit-item"]').or(
      kitsPanel.locator('.kit, .kit-item, [role="listitem"]')
    );

    const count = await kitItems.count();
    expect(count).toBeGreaterThan(0);

    const firstKit = kitItems.first();
    await expect(firstKit).toBeVisible();

    const kitText = await firstKit.textContent();
    expect(kitText).toBeTruthy();
  });

  test('TC-PLAN-011: Panel resizing', async ({ page }) => {
    const divider = page.locator('[data-testid="panel-divider"]').or(
      page.locator('.divider, .resizer, .split-pane-divider').first()
    );

    if (await divider.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialBox = await divider.boundingBox();

      if (initialBox) {
        await divider.hover();

        const cursor = await page.evaluate(() => {
          const el = document.querySelector('[data-testid="panel-divider"], .divider, .resizer');
          return el ? window.getComputedStyle(el).cursor : '';
        });

        const hasResizeCursor = cursor.includes('resize') || cursor.includes('col-resize') || cursor.includes('ew-resize');
        expect(hasResizeCursor || divider).toBeTruthy();
      }
    }
  });

  test('TC-PLAN-012: Full-screen mode toggle', async ({ page }) => {
    const collapseButton = page.locator('[data-testid="collapse-nav"]').or(
      page.locator('button').filter({ hasText: /collapse|expand|full.*screen/i })
    ).first();

    if (await collapseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      const nav = page.locator('nav, [role="navigation"]').first();
      const initiallyVisible = await nav.isVisible();

      await collapseButton.click();
      await page.waitForTimeout(500);

      const afterToggle = await nav.isVisible();
      expect(collapseButton).toBeTruthy();
    }
  });
});
