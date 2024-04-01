// @ts-check
import { expect, test } from "@playwright/test";

test('Basic webpage test', async ({ page }) => {
  await page.goto('/demos/index.html');

  console.log(await page.title())

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle( 'Vanilla LazyLoad - Demo Page' );

  // expect to find a list of links on the page
  await expect(page.locator('a')).toHaveCount(41)
});
