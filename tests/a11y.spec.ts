import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/til', '/notes', '/projects'];

for (const route of routes) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('a11y: contact modal', async ({ page }) => {
  // Disable CSS transitions so axe doesn't scan while the panel is mid-animation
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.click('[data-contact-trigger]');
  const modal = page.locator('#contact-modal');
  await expect(modal).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
