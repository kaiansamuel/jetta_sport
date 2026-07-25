import { test, expect } from "@playwright/test";

test("admin can log in, create a product, and see it live on the storefront", async ({
  page,
}) => {
  const uniqueName = `Tênis Playwright ${Date.now()}`;
  const uniqueSlug = `tenis-playwright-${Date.now()}`;

  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill("admin@jettasport.com.br");
  await page.getByLabel("Senha").fill("admin123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.goto("/admin/produtos/novo");
  await page.getByLabel("Nome").fill(uniqueName);
  await page.getByLabel("Slug").fill(uniqueSlug);
  await page.getByLabel("SKU").fill(`PW-${Date.now()}`);
  await page.getByLabel("Descrição curta").fill("Produto criado pelo teste e2e.");
  await page.getByLabel("Descrição completa").fill("Descrição completa do produto de teste.");

  await page.getByLabel("Marca").selectOption({ index: 1 });
  await page.getByLabel("Categoria").selectOption({ index: 1 });
  await page.getByLabel("Estilo").fill("Teste automatizado");
  await page.getByLabel("Preço (R$)").fill("299.90");

  await page
    .getByPlaceholder("Colar URL da imagem")
    .fill("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();

  await page.getByRole("button", { name: "Adicionar variante" }).click();
  await page.getByPlaceholder("Preto").fill("Preto");
  await page.getByPlaceholder("40").fill("40");

  await page.getByRole("button", { name: "Criar produto" }).click();
  await expect(page).toHaveURL(/\/admin\/produtos$/, { timeout: 10_000 });
  await expect(page.getByText(uniqueName)).toBeVisible();

  // Verify it's actually live on the public storefront, not just in the admin table.
  await page.goto(`/produto/${uniqueSlug}`);
  await expect(page.getByRole("heading", { name: uniqueName })).toBeVisible();

  // Cleanup through the same admin UI the test exercised, keeping the test
  // self-contained without reaching into the database directly.
  await page.goto("/admin/produtos");
  const row = page.locator("tr", { hasText: uniqueName });
  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: "Excluir" }).click();
  await expect(page.getByText(uniqueName)).not.toBeVisible();
});
