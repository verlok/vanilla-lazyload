import { expect, test } from "@playwright/test";

test("Basic image", async ({ page }) => {
  await page.goto("/demos/image_basic.html");
  const lazyLoadImages = await page.locator('img[data-src]');
  await page.waitForLoadState("load");
  const imageCount = await lazyLoadImages.count()
  
  // Eventually scroll into view and check if it loads
  for (let i = 0; i < imageCount; i++) {
    const image = lazyLoadImages.nth(i);
    await image.scrollIntoViewIfNeeded();

    // Check the src attribute
    const expectedSrc = await image.getAttribute('data-src');
    await expect(image).toHaveAttribute('src', expectedSrc);
  }
});
