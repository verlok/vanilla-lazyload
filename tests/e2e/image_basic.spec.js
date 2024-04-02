import { expect, test } from "@playwright/test";
const limit = 10;

const pagesWithSimpleImages = [
  { url: "/demos/image_basic.html", description: "Basic page" },
  { url: "/demos/async.html", description: "Async initialization" }
];

for (const { url, description } of pagesWithSimpleImages) {
  test(description, async ({ page }) => {
    await page.goto(url);
    const lazyLoadImages = await page.locator("img[data-src]");
    await page.waitForLoadState("load");
    const imageCount = limit //was: await lazyLoadImages.count();

    // Eventually scroll into view and check if it loads
    for (let i = 0; i < imageCount; i++) {
      const image = lazyLoadImages.nth(i);
      await image.scrollIntoViewIfNeeded();

      // Check the src attribute
      const expectedSrc = await image.getAttribute("data-src");
      await expect(image).toHaveAttribute("src", expectedSrc);
    }
  });

  // You can also do it with test.describe() or with multiple tests as long the test name is unique.
}