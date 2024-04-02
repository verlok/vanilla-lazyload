// @ts-check
import { expect, test } from "@playwright/test";

test("Basic usage", async ({ page }) => {
  await page.goto("/demos/image_basic.html");

  // Find all images with data-src attribute
  const lazyLoadImages = await page.locator('img[data-src]');

  // Wait for page loaded
  await page.waitForLoadState("load");

  // For each image with data-src attribute, scroll into view and check if it loads
  const imageCount = await lazyLoadImages.count()

  for (let i = 0; i < imageCount; i++) {
    const image = lazyLoadImages.nth(i);

    // Scroll to the image
    await image.scrollIntoViewIfNeeded();

    // Wait for lazy loaded image to have a src attribute
    const expected = await image.getAttribute('data-src');
    await expect(image).toHaveAttribute('src', expected);
  }
});
