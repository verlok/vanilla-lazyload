import { expect, test } from "@playwright/test";

const pagesWithSimpleImages = [
  { url: "/demos/image_basic.html", description: "Basic usage with image" },
  { url: "/demos/image_ph_inline.html", description: "With inline placeholder image" },
  { url: "/demos/image_ph_external.html", description: "With external placeholder image" },
  { url: "/demos/async.html", description: "Async initialization" },
  { url: "/demos/async_multiple.html", description: "Async initialization - multiple instances" },
];

for (const { url, description } of pagesWithSimpleImages) {
  test(description, async ({ page }) => {
    await page.goto(url);
    const lazyImages = await page.locator(".lazy");
    await page.waitForLoadState("load");
    const imageCount = await lazyImages.count();

    // Eventually scroll into view and check if it loads
    for (let i = 0; i < imageCount; i++) {
      const image = lazyImages.nth(i);
      await image.scrollIntoViewIfNeeded();

      // Check the src attribute
      const expectedSrc = await image.getAttribute("data-src");
      await expect(image).toHaveAttribute("src", expectedSrc);
    }
  });
}
