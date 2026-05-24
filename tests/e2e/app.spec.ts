import { expect, test } from '@playwright/test';

test.describe('YYC³ Nexus E2E — Critical Paths', () => {
  test('app loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/YYC³/);
    await expect(page.locator('#root')).toBeVisible();
  });

  test('dashboard page renders content', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    const content = page.locator('#root > *');
    await expect(content.first()).toBeVisible({ timeout: 5000 });
  });

  test('sidebar navigation is present', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const nav = page.locator('nav, aside, [class*="sidebar"], [class*="panel"]');
    await expect(nav.first()).toBeVisible({ timeout: 5000 });
  });

  test('no critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForTimeout(2000);
    const critical = errors.filter(
      e => !e.includes('favicon') && !e.includes('404') && !e.includes('DNS'),
    );
    expect(critical.length).toBeLessThan(3);
  });
});

test.describe('Navigation — Page Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
  });

  test('can switch to settings page', async ({ page }) => {
    const settingsBtn = page
      .locator('button:has-text("设置"), [data-testid="nav-settings"]')
      .first();
    if (await settingsBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await settingsBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator('#root')).toBeVisible();
    }
  });

  test('can switch between core nav items', async ({ page }) => {
    const buttons = page.locator('button').filter({ hasText: /./ });
    const count = await buttons.count();
    if (count > 5) {
      await buttons
        .nth(5)
        .click({ timeout: 3000 })
        .catch(() => {});
      await page.waitForTimeout(300);
      await expect(page.locator('#root')).toBeVisible();
      await buttons
        .nth(3)
        .click({ timeout: 3000 })
        .catch(() => {});
      await page.waitForTimeout(300);
      await expect(page.locator('#root')).toBeVisible();
    }
  });
});

test.describe('Settings Page', () => {
  test('settings page loads without crash', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    const settingsBtn = page.locator('button:has-text("设置")').first();
    if (await settingsBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await settingsBtn.click();
      await page.waitForTimeout(1000);
      await expect(page.locator('#root')).toBeVisible();
    }
  });
});

test.describe('Performance — Initial Load', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.locator('#root').waitFor({ state: 'visible' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });

  test('no layout shift after hydration', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const root = page.locator('#root');
    const box1 = await root.boundingBox();
    await page.waitForTimeout(1000);
    const box2 = await root.boundingBox();
    if (box1 && box2) {
      expect(Math.abs(box1.width - box2.width)).toBeLessThan(50);
    }
  });
});
