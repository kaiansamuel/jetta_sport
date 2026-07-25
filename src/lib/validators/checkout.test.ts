import { describe, expect, it } from "vitest";
import { checkoutSchema, submitOrderSchema } from "./checkout";

describe("checkoutSchema", () => {
  const valid = {
    customerName: "João da Silva",
    phone: "11999999999",
    zipCode: "74000-000",
  };

  it("accepts the minimal required fields", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = checkoutSchema.safeParse({ ...valid, customerName: "J" });
    expect(result.success).toBe(false);
  });

  it("rejects a phone that's too short", () => {
    const result = checkoutSchema.safeParse({ ...valid, phone: "119999" });
    expect(result.success).toBe(false);
  });

  it("rejects a CEP shorter than 8 characters", () => {
    const result = checkoutSchema.safeParse({ ...valid, zipCode: "7400" });
    expect(result.success).toBe(false);
  });

  it("treats address, notes, and delivery type as optional", () => {
    const result = checkoutSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

describe("submitOrderSchema", () => {
  const validItem = {
    variantId: "v1",
    productId: "p1",
    productSlug: "produto-teste",
    productName: "Produto Teste",
    imageUrl: null,
    color: "Preto",
    size: "40",
    quantity: 1,
    unitPrice: 100,
  };

  it("rejects an empty cart", () => {
    const result = submitOrderSchema.safeParse({
      customer: {
        customerName: "João da Silva",
        phone: "11999999999",
        zipCode: "74000-000",
      },
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive quantity", () => {
    const result = submitOrderSchema.safeParse({
      customer: {
        customerName: "João da Silva",
        phone: "11999999999",
        zipCode: "74000-000",
      },
      items: [{ ...validItem, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative unit price", () => {
    const result = submitOrderSchema.safeParse({
      customer: {
        customerName: "João da Silva",
        phone: "11999999999",
        zipCode: "74000-000",
      },
      items: [{ ...validItem, unitPrice: -1 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid single-item order", () => {
    const result = submitOrderSchema.safeParse({
      customer: {
        customerName: "João da Silva",
        phone: "11999999999",
        zipCode: "74000-000",
      },
      items: [validItem],
    });
    expect(result.success).toBe(true);
  });
});
