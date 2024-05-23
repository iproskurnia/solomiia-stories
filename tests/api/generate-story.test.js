const { test, expect } = require('@playwright/test');

test('API should generate a story and image', async ({ request }) => {
  const response = await request.post('/generate-story', {
    multipart: {
      prompt: 'Once upon a time, there was a brave knight',
      image: {
        name: 'knight.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('...') // Dummy buffer for testing
      }
    }
  });
  expect(response.ok()).toBeTruthy();
  const responseData = await response.json();
  expect(responseData.story).toContain('Once upon a time');
  expect(responseData.imageUrl).toMatch(/^https?:\/\//);
});
