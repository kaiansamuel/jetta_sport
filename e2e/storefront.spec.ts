import { test, expect } from "@playwright/test";

// Note: this test exercises the real submitOrder Server Action against
// whatever database DATABASE_URL points at, so it leaves a permanent Order
// row behind each run (orders are intentionally not deletable from the
// admin UI — see deleteProduct's guard for the same "preserve order
// history" reasoning). Running this suite repeatedly against a shared dev
// database will accumulate JS-2026-XXXXX test orders; `pnpm db:reset &&
// pnpm db:seed` clears them. Point at a disposable database for CI.
test("browse, filter, add to cart, and complete checkout via WhatsApp", async ({
  page,
  context,
}) => {
  const uniquePhone = `11${Date.now()}`.slice(0, 11);

  await page.goto("/catalogo");
  await expect(page.getByRole("heading", { name: "Catálogo" })).toBeVisible();

  // Filter by a known seeded category.
  await page.getByRole("button", { name: "Corrida", exact: true }).click();
  await expect(page).toHaveURL(/categoria=corrida/);

  // Open the first product in the filtered results.
  await page.getByRole("link", { name: "Ver detalhes" }).first().click();
  await expect(page.getByRole("button", { name: "Adicionar ao carrinho" })).toBeVisible();

  // Pick the first color, then the first enabled (in-stock) size.
  await page.locator('fieldset:has-text("Cor") button').first().click();
  await page.locator('fieldset:has-text("Numeração") button:not([disabled])').first().click();

  const addToCartButton = page.getByRole("button", { name: "Adicionar ao carrinho" });
  await expect(addToCartButton).toBeEnabled();
  await addToCartButton.click();
  await expect(page.getByRole("button", { name: "Adicionado ao carrinho!" })).toBeVisible();

  // Go to the full cart page and proceed to checkout.
  await page.goto("/carrinho");
  await expect(page.getByRole("heading", { name: "Carrinho" })).toBeVisible();
  await page.getByRole("link", { name: "Finalizar pelo WhatsApp" }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel("Nome completo").fill("Playwright E2E Tester");
  await page.getByLabel("Telefone / WhatsApp").fill(uniquePhone);
  await page.getByLabel("CEP").fill("74000-000");

  const [popup] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: "Finalizar pelo WhatsApp" }).click(),
  ]);
  await popup.waitForLoadState("domcontentloaded").catch(() => {});
  // wa.me itself redirects server-side to api.whatsapp.com/send almost
  // immediately, so by the time the popup finishes loading the URL has
  // already moved on — landing on WhatsApp's real domain is the stronger
  // signal that the link (and its encoded message) actually worked.
  expect(popup.url()).toMatch(/wa\.me|whatsapp\.com/);
  const decodedMessage = decodeURIComponent(popup.url().replace(/\+/g, "%20"));
  expect(decodedMessage).toContain("PEDIDO: JS-");

  // The order-before-WhatsApp guarantee (DB write happens before the wa.me
  // handoff) is verified separately in a direct Server Action integration
  // check, not re-derived here — this test verifies the user-facing
  // black-box flow: the confirmation page only renders a real order code
  // once submitOrder has actually persisted the order server-side.
  await expect(page).toHaveURL(/\/checkout\/confirmacao\//, { timeout: 10_000 });
  await expect(
    page.getByRole("heading", { name: /Pedido JS-\d{4}-\d{5} registrado/ }),
  ).toBeVisible();
});

test("blocks adding to cart until a size is selected", async ({ page }) => {
  await page.goto("/produto/nike-air-zoom-pulse");
  await expect(page.getByText("Selecione a numeração para adicionar ao carrinho.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Adicionar ao carrinho" })).toBeDisabled();
});
