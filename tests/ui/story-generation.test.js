const { test, expect } = require('@playwright/test');

test('should generate story and display it', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#story-prompt', 'Once upon a time, there was a brave knight');
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('#image')
  ]);
  await fileChooser.setFiles('tests/assets/knight.jpg'); // Add a sample image to your tests/assets folder
  await page.click('text=Згенерувати');
  await page.waitForSelector('#story-content');
  const storyContent = await page.textContent('#story-content');
  expect(storyContent).toContain('Once upon a time');
});
