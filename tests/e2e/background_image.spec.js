import { expect, test } from "@playwright/test";

const pagesWithSimpleImages = [
  { url: "/demos/background_images.html", description: "Background images" }
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
      const dataBg = await element.getAttribute("data-bg");
      const dataBgHidpi = await element.getAttribute("data-bg-hidpi");
      const expectedBg = `background-image: url("${dataBg}");`;
      const expectedHiDpiBg = `background-image: url("${dataBgHidpi}");`;

      if (!dataBgHidpi) {
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
