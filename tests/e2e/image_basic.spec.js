// @ts-check
import { expect, test } from "@playwright/test";

test("Esm webpage test", async ({ page }) => {
  await page.goto("/demos/image_basic.html");

  page.on('console', async (msg) => {
    const msgArgs = msg.args();
    const logValues = await Promise.all(msgArgs.map(async arg => await arg.jsonValue()));
    console.log(...logValues);
  });

  // Find all images with data-src attribute
  const lazyLoadImages = await page.locator('img[data-src]');

  await page.waitForLoadState("load");

// For each image with data-src attribute, scroll into view and check if it loads
  const imageCount = await lazyLoadImages.count()

  for (let i = 0; i < imageCount; i++) {
    const image = lazyLoadImages.nth(i);

    // Scroll to the image
    await image.scrollIntoViewIfNeeded();

    // Wait for lazy loaded image to have a src attribute
    await expect(image).toHaveAttribute('src', await image.getAttribute('data-src'));
  }
});
