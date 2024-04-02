import { expect, test } from "@playwright/test";

const pagesWithSimpleImages = [
  { url: "/demos/background_images_multi.html", description: "Multiple background images" }
];

for (const { url, description } of pagesWithSimpleImages) {
  test(description, async ({ page }) => {
    await page.goto(url);
    const lazyElements = await page.locator(".lazy");
    await page.waitForLoadState("load");
    const elementsCount = await lazyElements.count();

    const devicePixelRatio = await page.evaluate(() => window.devicePixelRatio);

    // Eventually scroll into view and check if it loads
    for (let i = 0; i < elementsCount; i++) {
      const element = lazyElements.nth(i);
      await element.scrollIntoViewIfNeeded();

      // Set expectations
      const dataBgMulti = await element.getAttribute("data-bg-multi");
      const dataBgMultiHidpi = await element.getAttribute("data-bg-multi-hidpi");
      const expectedBg = `background-image: ${dataBgMulti};`;
      const expectedHiDpiBg = `background-image: ${dataBgMultiHidpi};`;

      if (!dataBgMultiHidpi) {
        await expect(element).toHaveAttribute("style", expectedBg);
        continue;
      }

      if (devicePixelRatio > 1) {
        await expect(element).toHaveAttribute("style", expectedHiDpiBg);
      } else {
        await expect(element).toHaveAttribute("style", expectedBg);
      }
    }
  });
}
