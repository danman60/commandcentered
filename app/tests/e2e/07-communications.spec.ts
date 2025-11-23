/**
 * E2E Tests: Communications Module
 * Test Coverage: 8 scenarios for Telegram Integration and Notification Log
 * Features: Phase 2 Communications (Telegram groups, notification tracking)
 */

import { test, expect } from '@playwright/test';

test.describe('Communications Module @p0 @communications', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Navigate to Communications
    await page.goto('/communications');
    await page.waitForLoadState('networkidle');
  });

  test('TC-COMM-001: Communications page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/communications/);
    const heading = page.locator('h1, h2').filter({ hasText: /communications/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('TC-COMM-002: Tab navigation works (Email, SMS, Telegram, Notification Log)', async ({ page }) => {
    // Check Email tab (default)
    const emailTab = page.locator('button').filter({ hasText: /email/i }).first();
    await expect(emailTab).toBeVisible();

    // Click SMS tab
    const smsTab = page.locator('button').filter({ hasText: /sms/i }).first();
    await smsTab.click();
    await page.waitForTimeout(500);

    // Click Telegram tab
    const telegramTab = page.locator('button').filter({ hasText: /telegram/i }).first();
    await telegramTab.click();
    await page.waitForTimeout(500);

    // Verify Telegram content appears
    const telegramContent = page.locator('text=/Telegram Groups|telegram|group/i').first();
    await expect(telegramContent).toBeVisible({ timeout: 3000 });

    // Click Notification Log tab
    const notificationTab = page.locator('button').filter({ hasText: /notification/i }).first();
    await notificationTab.click();
    await page.waitForTimeout(500);

    // Verify Notification Log content appears
    const notificationContent = page.locator('text=/Notification Log|notifications/i').first();
    await expect(notificationContent).toBeVisible({ timeout: 3000 });
  });

  test('TC-COMM-003: Telegram Integration tab displays groups', async ({ page }) => {
    // Navigate to Telegram tab
    const telegramTab = page.locator('button').filter({ hasText: /telegram/i }).first();
    await telegramTab.click();
    await page.waitForTimeout(500);

    // Check for Telegram groups heading
    const heading = page.locator('h2, h3').filter({ hasText: /Telegram Groups/i }).first();
    await expect(heading).toBeVisible({ timeout: 3000 });

    // Check for Create Group button
    const createButton = page.locator('button').filter({ hasText: /Create Group/i }).first();
    await expect(createButton).toBeVisible();
  });

  test('TC-COMM-004: Telegram group cards display correctly', async ({ page }) => {
    // Navigate to Telegram tab
    const telegramTab = page.locator('button').filter({ hasText: /telegram/i }).first();
    await telegramTab.click();
    await page.waitForTimeout(500);

    // Look for group cards (they should have group names or member counts)
    const groupCards = page.locator('text=/members|operators|Active|Group ID/i');
    const count = await groupCards.count();

    // Should have at least some group information visible
    expect(count).toBeGreaterThan(0);
  });

  test('TC-COMM-005: Notification Log tab displays notification entries', async ({ page }) => {
    // Navigate to Notification Log tab
    const notificationTab = page.locator('button').filter({ hasText: /notification/i }).first();
    await notificationTab.click();
    await page.waitForTimeout(500);

    // Check for Notification Log heading
    const heading = page.locator('h2, h3').filter({ hasText: /Notification Log/i }).first();
    await expect(heading).toBeVisible({ timeout: 3000 });

    // Check for filter dropdowns
    const channelFilter = page.locator('select').filter({ hasText: /All Channels|Email|SMS|Telegram/i }).first();
    await expect(channelFilter).toBeVisible();

    const statusFilter = page.locator('select').filter({ hasText: /All Statuses|Sent|Failed|Pending/i }).first();
    await expect(statusFilter).toBeVisible();
  });

  test('TC-COMM-006: Notification Log shows notification details', async ({ page }) => {
    // Navigate to Notification Log tab
    const notificationTab = page.locator('button').filter({ hasText: /notification/i }).first();
    await notificationTab.click();
    await page.waitForTimeout(500);

    // Look for notification entries with status badges
    const statusBadges = page.locator('text=/Sent|Failed|Pending/i');
    const badgeCount = await statusBadges.count();

    // Should have status badges visible
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('TC-COMM-007: Notification Log pagination controls exist', async ({ page }) => {
    // Navigate to Notification Log tab
    const notificationTab = page.locator('button').filter({ hasText: /notification/i }).first();
    await notificationTab.click();
    await page.waitForTimeout(500);

    // Check for pagination buttons
    const previousButton = page.locator('button').filter({ hasText: /Previous/i }).first();
    const nextButton = page.locator('button').filter({ hasText: /Next/i }).first();

    await expect(previousButton).toBeVisible({ timeout: 3000 });
    await expect(nextButton).toBeVisible();
  });

  test('TC-COMM-008: Notification Log filters are functional', async ({ page }) => {
    // Navigate to Notification Log tab
    const notificationTab = page.locator('button').filter({ hasText: /notification/i }).first();
    await notificationTab.click();
    await page.waitForTimeout(500);

    // Test channel filter
    const channelFilter = page.locator('select').first();
    await channelFilter.selectOption({ label: 'Email Only' });
    await page.waitForTimeout(500);

    // Test status filter
    const statusFilter = page.locator('select').nth(1);
    await statusFilter.selectOption({ label: 'Sent' });
    await page.waitForTimeout(500);

    // Verify page doesn't crash and content still visible
    const notificationContent = page.locator('text=/Notification Log/i').first();
    await expect(notificationContent).toBeVisible();
  });
});
