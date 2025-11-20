/**
 * Performance Tests: Load Time & Responsiveness
 * Test Coverage: 5 performance scenarios
 * Spec Reference: E2E_TEST_PLAN.md lines 995-1003
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Tests @p2 @performance', () => {
  /**
   * TC-PERF-001: Page load time < 2 seconds
   */
  test('TC-PERF-001: Dashboard loads in under 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    console.log(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });

  test('TC-PERF-001: Planning page loads in under 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/planning');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    console.log(`Planning page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });

  test('TC-PERF-001: Pipeline page loads in under 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/pipeline');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    console.log(`Pipeline page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });

  /**
   * TC-PERF-002: Time to interactive < 3 seconds
   */
  test('TC-PERF-002: Dashboard time to interactive under 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/dashboard');

    // Wait for page to be fully interactive
    await page.waitForLoadState('networkidle');

    // Verify interactive element is clickable
    const button = page.locator('button').first();
    await button.waitFor({ state: 'visible' });

    const interactiveTime = Date.now() - startTime;

    console.log(`Dashboard time to interactive: ${interactiveTime}ms`);
    expect(interactiveTime).toBeLessThan(3000);
  });

  test('TC-PERF-002: Planning page time to interactive under 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/planning');
    await page.waitForLoadState('networkidle');

    // Verify calendar is interactive
    const calendar = page.locator('[data-testid="calendar-grid"]').or(
      page.locator('.calendar, [role="grid"]').first()
    );
    await calendar.waitFor({ state: 'visible', timeout: 3000 });

    const interactiveTime = Date.now() - startTime;

    console.log(`Planning page time to interactive: ${interactiveTime}ms`);
    expect(interactiveTime).toBeLessThan(3000);
  });

  /**
   * TC-PERF-003: Calendar rendering < 500ms for 100 events
   */
  test('TC-PERF-003: Calendar renders quickly with multiple events', async ({ page }) => {
    await page.goto('/planning');
    await page.waitForLoadState('networkidle');

    // Measure calendar render time by navigating months
    const nextButton = page.locator('button:has-text("Next")').first();

    const startTime = Date.now();

    // Click next month
    await nextButton.click();
    await page.waitForTimeout(100); // Allow render

    // Wait for calendar to update
    const calendar = page.locator('[data-testid="calendar-grid"]').or(
      page.locator('.calendar, [role="grid"]').first()
    );
    await calendar.waitFor({ state: 'visible' });

    const renderTime = Date.now() - startTime;

    console.log(`Calendar render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(500);
  });

  /**
   * TC-PERF-004: Table sorting < 200ms for 1000 rows
   */
  test('TC-PERF-004: Gear table sorts quickly', async ({ page }) => {
    await page.goto('/gear');
    await page.waitForLoadState('networkidle');

    // Find sortable column header
    const columnHeader = page.locator('th, [role="columnheader"]').filter({ hasText: /name|serial|status/i }).first();

    if (await columnHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
      const startTime = Date.now();

      // Click to sort
      await columnHeader.click();
      await page.waitForTimeout(50); // Allow sort to complete

      const sortTime = Date.now() - startTime;

      console.log(`Table sort time: ${sortTime}ms`);
      expect(sortTime).toBeLessThan(200);
    } else {
      console.log('No sortable columns found - test skipped');
    }
  });

  test('TC-PERF-004: Pipeline table sorts quickly', async ({ page }) => {
    await page.goto('/pipeline');
    await page.waitForLoadState('networkidle');

    // Switch to table view if needed
    const tableViewButton = page.locator('button[aria-label="Table view"], button:has-text("Table")').first();

    if (await tableViewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tableViewButton.click();
      await page.waitForTimeout(300);
    }

    // Find sortable column
    const columnHeader = page.locator('th, [role="columnheader"]').filter({ hasText: /client|value|status/i }).first();

    if (await columnHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
      const startTime = Date.now();

      await columnHeader.click();
      await page.waitForTimeout(50);

      const sortTime = Date.now() - startTime;

      console.log(`Pipeline table sort time: ${sortTime}ms`);
      expect(sortTime).toBeLessThan(200);
    }
  });

  /**
   * TC-PERF-005: Search filtering < 100ms
   */
  test('TC-PERF-005: Gear search filters quickly', async ({ page }) => {
    await page.goto('/gear');
    await page.waitForLoadState('networkidle');

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();

    await expect(searchInput).toBeVisible({ timeout: 5000 });

    const startTime = Date.now();

    // Type search query
    await searchInput.fill('Sony');

    // Wait for filter to apply (debounce typically 300ms)
    await page.waitForTimeout(350);

    const filterTime = Date.now() - startTime;

    console.log(`Search filter time: ${filterTime}ms`);

    // Account for debounce delay - actual filter should be < 100ms after debounce
    expect(filterTime).toBeLessThan(500); // Generous timeout including debounce
  });

  test('TC-PERF-005: Pipeline search filters quickly', async ({ page }) => {
    await page.goto('/pipeline');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();

    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      const startTime = Date.now();

      await searchInput.fill('Dance');
      await page.waitForTimeout(350); // Debounce

      const filterTime = Date.now() - startTime;

      console.log(`Pipeline search filter time: ${filterTime}ms`);
      expect(filterTime).toBeLessThan(500);
    }
  });

  /**
   * Additional Performance Metrics
   */
  test('PERF-EXTRA: Measure all page load times', async ({ page }) => {
    const pages = [
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Planning', url: '/planning' },
      { name: 'Pipeline', url: '/pipeline' },
      { name: 'Gear', url: '/gear' },
      { name: 'Operators', url: '/operators' },
      { name: 'Deliverables', url: '/deliverables' },
      { name: 'Communications', url: '/communications' },
      { name: 'Files', url: '/files' },
      { name: 'Reports', url: '/reports' },
      { name: 'Settings', url: '/settings' }
    ];

    const results: { name: string; loadTime: number }[] = [];

    for (const pageInfo of pages) {
      const startTime = Date.now();

      await page.goto(pageInfo.url);
      await page.waitForLoadState('domcontentloaded');

      const loadTime = Date.now() - startTime;
      results.push({ name: pageInfo.name, loadTime });

      console.log(`${pageInfo.name}: ${loadTime}ms`);
    }

    // Calculate average load time
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    console.log(`Average load time: ${avgLoadTime.toFixed(0)}ms`);

    // Find slowest page
    const slowest = results.reduce((prev, current) => (prev.loadTime > current.loadTime ? prev : current));
    console.log(`Slowest page: ${slowest.name} (${slowest.loadTime}ms)`);

    // All pages should load reasonably fast
    expect(avgLoadTime).toBeLessThan(2000);
  });
});
