// @ts-check
const { test, expect } = require('@playwright/test');

test('Basic webpage test', async ({ page }) => {
  await page.goto('/');


  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Lazyload demos/);


  // expect to find a list of links on the page
  await expect(page.locator('a')).toHaveCount(41)
});

test('Esm webpage test', async ({ page }) => {
  await page.goto('/esm.html');

  // Wait for images to load initially
  await page.waitForLoadState('load');

  // Find all images with data-src attribute
  const lazyLoadImages = await page.locator('img[data-src]').all();

  // Scroll the page to make sure lazy load images are in the viewport
  for (const image of lazyLoadImages) {

    // Get the src and data-src attributes
    const src = await image.getAttribute('src');
    const dataSrc = await image.getAttribute('data-src');

    // Assert that src is null initially
    expect(src).toBe(null);

    await image.scrollIntoViewIfNeeded();

    // Get the updated src attribute after lazy loading
    const newSrc = await image.getAttribute('src');

    // Assert that the src attribute has been updated
    expect(newSrc).not.toBe(dataSrc);
  }
});
