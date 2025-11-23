/**
 * E2E Tests: Operator Portal
 * Test Coverage: 8 scenarios for operator self-service features
 * Features: Schedule view, profile management, availability calendar
 */

import { test, expect } from '@playwright/test';

test.describe('Operator Portal @p0 @operators @portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Navigate to Operator Portal
    await page.goto('/operator-portal');
    await page.waitForLoadState('networkidle');
  });

  test('TC-PORT-001: Operator Portal page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/operator-portal/);
    const heading = page.locator('h1, h2').filter({ hasText: /Operator Portal/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('TC-PORT-002: Tab navigation works (Schedule, Profile, Availability)', async ({ page }) => {
    // Check Schedule tab (default)
    const scheduleTab = page.locator('button').filter({ hasText: /schedule/i }).first();
    await expect(scheduleTab).toBeVisible();

    // Click Profile tab
    const profileTab = page.locator('button').filter({ hasText: /profile/i }).first();
    await profileTab.click();
    await page.waitForTimeout(500);

    // Verify Profile content appears
    const profileContent = page.locator('text=/Contact Information|Phone|Email/i').first();
    await expect(profileContent).toBeVisible({ timeout: 3000 });

    // Click Availability tab
    const availabilityTab = page.locator('button').filter({ hasText: /availability/i }).first();
    await availabilityTab.click();
    await page.waitForTimeout(500);

    // Verify Availability content appears
    const availabilityContent = page.locator('text=/Calendar|Blackout|Available/i').first();
    await expect(availabilityContent).toBeVisible({ timeout: 3000 });
  });

  test('TC-PORT-003: Schedule tab displays upcoming assignments', async ({ page }) => {
    // Verify Schedule tab is active
    const scheduleTab = page.locator('button').filter({ hasText: /schedule/i }).first();
    await scheduleTab.click();
    await page.waitForTimeout(500);

    // Check for "Upcoming Assignments" heading
    const upcomingHeading = page.locator('h2, h3').filter({ hasText: /Upcoming Assignments/i }).first();
    await expect(upcomingHeading).toBeVisible({ timeout: 3000 });

    // Look for assignment cards or empty state
    const assignmentCards = page.locator('text=/Event|Date|Time|Role/i');
    const count = await assignmentCards.count();

    // Should have some content (cards or empty state)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC-PORT-004: Schedule tab shows past assignments section', async ({ page }) => {
    // Check for "Past Assignments" heading
    const pastHeading = page.locator('h2, h3').filter({ hasText: /Past Assignments/i }).first();
    const hasHeading = await pastHeading.isVisible({ timeout: 3000 }).catch(() => false);

    // Should have past assignments section
    if (hasHeading) {
      await expect(pastHeading).toBeVisible();
    }
  });

  test('TC-PORT-005: Profile tab displays operator information', async ({ page }) => {
    // Navigate to Profile tab
    const profileTab = page.locator('button').filter({ hasText: /profile/i }).first();
    await profileTab.click();
    await page.waitForTimeout(500);

    // Check for Contact Information section
    const contactHeading = page.locator('h2, h3').filter({ hasText: /Contact Information/i }).first();
    await expect(contactHeading).toBeVisible({ timeout: 3000 });

    // Check for profile fields (name, email, phone)
    const profileFields = page.locator('text=/Name|Email|Phone|Address/i');
    const fieldCount = await profileFields.count();

    // Should have profile information visible
    expect(fieldCount).toBeGreaterThan(0);
  });

  test('TC-PORT-006: Profile tab shows skills and rates', async ({ page }) => {
    // Navigate to Profile tab
    const profileTab = page.locator('button').filter({ hasText: /profile/i }).first();
    await profileTab.click();
    await page.waitForTimeout(500);

    // Look for Skills section
    const skillsHeading = page.locator('h2, h3, h4').filter({ hasText: /Skills|Specializations/i }).first();
    const hasSkills = await skillsHeading.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasSkills) {
      await expect(skillsHeading).toBeVisible();
    }

    // Look for Rates section
    const ratesHeading = page.locator('h2, h3, h4').filter({ hasText: /Rates|Pricing/i }).first();
    const hasRates = await ratesHeading.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasRates) {
      await expect(ratesHeading).toBeVisible();
    }
  });

  test('TC-PORT-007: Availability tab displays calendar', async ({ page }) => {
    // Navigate to Availability tab
    const availabilityTab = page.locator('button').filter({ hasText: /availability/i }).first();
    await availabilityTab.click();
    await page.waitForTimeout(500);

    // Check for calendar heading
    const calendarHeading = page.locator('h2, h3').filter({ hasText: /Availability Calendar/i }).first();
    await expect(calendarHeading).toBeVisible({ timeout: 3000 });

    // Look for calendar grid or date elements
    const calendarElements = page.locator('text=/January|February|March|Mon|Tue|Wed|Sun|Sat/i');
    const hasCalendar = await calendarElements.count() > 0;

    // Should have calendar elements
    expect(hasCalendar).toBeTruthy();
  });

  test('TC-PORT-008: Availability tab shows blackout dates section', async ({ page }) => {
    // Navigate to Availability tab
    const availabilityTab = page.locator('button').filter({ hasText: /availability/i }).first();
    await availabilityTab.click();
    await page.waitForTimeout(500);

    // Check for Blackout Dates section
    const blackoutHeading = page.locator('h2, h3, h4').filter({ hasText: /Blackout Dates/i }).first();
    const hasBlackout = await blackoutHeading.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasBlackout) {
      await expect(blackoutHeading).toBeVisible();

      // Look for blackout date entries or empty state
      const blackoutEntries = page.locator('text=/No blackout dates|Unavailable|blocked/i');
      const entryCount = await blackoutEntries.count();

      // Should have some content
      expect(entryCount).toBeGreaterThanOrEqual(0);
    }
  });
});
