import { expect, test } from "@playwright/test";

test("storefront and customer entry point render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /jogos em destaque/i })).toBeVisible();
  await page.getByRole("button", { name: /abrir minha conta/i }).click();
  await expect(page.getByRole("heading", { name: /entre na game store/i })).toBeVisible();
});

test("admin login renders", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /painel administrativo/i })).toBeVisible();
});
