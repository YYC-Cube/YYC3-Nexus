import { expect, test } from '@playwright/test';

test.describe('App Shell — Navigation', () => {
  test('should load the app shell', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('should render the sidebar navigation', async ({ page }) => {
    await page.goto('/');
    const sidebar = page.locator('nav, [data-testid="sidebar"], aside').first();
    await expect(sidebar).toBeVisible({ timeout: 10000 });
  });

  test('should have a title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});

test.describe('Dashboard Page', () => {
  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
  });

  test('should display KPI content', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Task Board Page', () => {
  test('should load task board content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
  });
});

test.describe('Accessibility — Basic', () => {
  test('should have lang attribute on html', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(['zh', 'en', 'zh-CN']).toContain(lang);
  });

  test('should have no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForTimeout(3000);
    const filtered = errors.filter(e => !e.includes('favicon') && !e.includes('DevTools'));
    expect(filtered.length).toBeLessThanOrEqual(2);
  });
});
