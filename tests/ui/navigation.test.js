const { test, expect } = require('@playwright/test');

test('should navigate to stories section', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Історії');
  expect(await page.isVisible('#stories')).toBeTruthy();
});
