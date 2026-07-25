import { describe, expect, it } from "vitest";
import { buildOrderMessage } from "./buildOrderMessage";

// Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }) inserts
// a non-breaking space (U+00A0) between "R$" and the amount, not a regular
// space. Building it via fromCharCode keeps that explicit instead of relying
// on an invisible character in the source, which would silently break the
// exact-match assertions below if ever mis-copied.
const NBSP = String.fromCharCode(160);

describe("buildOrderMessage", () => {
  it("matches the PRD section 11.3 example format with the default template", () => {
    const message = buildOrderMessage({
      code: "JS-2026-00451",
      storeName: "Jetta Sport",
      items: [
        {
          productName: "Mizuno Wave",
          color: "Vermelho",
          size: "40",
          quantity: 1,
          unitPrice: 399.9,
        },
        {
          productName: "Nike Air",
          color: "Preto",
          size: "39",
          quantity: 1,
          unitPrice: 449.9,
        },
      ],
      subtotal: 849.8,
      customerName: "João da Silva",
      zipCode: "74000-000",
      city: "Goiânia",
      state: "GO",
      deliveryType: null,
      notes: "Preferência de entrega à tarde.",
    });

    expect(message).toBe(
      [
        "Olá, Jetta Sport! Quero finalizar este pedido:",
        "",
        "PEDIDO: JS-2026-00451",
        "",
        "1x Mizuno Wave",
        "Cor: Vermelho",
        "Tamanho: 40",
        `Preço: R$${NBSP}399,90`,
        "",
        "1x Nike Air",
        "Cor: Preto",
        "Tamanho: 39",
        `Preço: R$${NBSP}449,90`,
        "",
        `Subtotal: R$${NBSP}849,80`,
        "",
        "Cliente: João da Silva",
        "CEP: 74000-000",
        "Cidade: Goiânia - GO",
        "Entrega: Calcular frete",
        "Observação: Preferência de entrega à tarde.",
        "",
        "Aguardo a confirmação de estoque, frete e pagamento.",
      ].join("\n"),
    );
  });

  it("uses a custom admin-configured template instead of the default when provided", () => {
    const message = buildOrderMessage(
      {
        code: "JS-2026-00001",
        storeName: "Jetta Sport",
        items: [
          { productName: "Tênis X", color: "Preto", size: "40", quantity: 1, unitPrice: 100 },
        ],
        subtotal: 100,
        customerName: "Teste",
      },
      "Pedido {code} - {subtotal}",
    );

    expect(message).toBe(`Pedido JS-2026-00001 - R$${NBSP}100,00`);
  });

  it("falls back to the default template when the admin template is blank", () => {
    const message = buildOrderMessage(
      {
        code: "JS-2026-00003",
        storeName: "Jetta Sport",
        items: [],
        subtotal: 0,
        customerName: "Teste",
      },
      "   ",
    );

    expect(message).toContain("Olá, Jetta Sport! Quero finalizar este pedido:");
  });

  it("falls back to sensible defaults for missing optional customer fields", () => {
    const message = buildOrderMessage({
      code: "JS-2026-00002",
      storeName: "Jetta Sport",
      items: [],
      subtotal: 0,
      customerName: "Teste",
    });

    expect(message).toContain("CEP: Não informado");
    expect(message).toContain("Cidade: Não informado");
    expect(message).toContain("Entrega: Calcular frete");
    expect(message).toContain("Observação: Nenhuma");
  });

  it("joins city and state with a dash only when both are present", () => {
    const cityOnly = buildOrderMessage({
      code: "JS-2026-00004",
      storeName: "Jetta Sport",
      items: [],
      subtotal: 0,
      customerName: "Teste",
      city: "Goiânia",
    });
    expect(cityOnly).toContain("Cidade: Goiânia\n");
  });
});
