import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Informe seu nome completo"),
  phone: z
    .string()
    .min(10, "Informe um telefone válido com DDD")
    .max(20, "Telefone inválido"),
  zipCode: z.string().min(8, "Informe um CEP válido").max(9, "CEP inválido"),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  complement: z.string().optional(),
  deliveryType: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const cartItemSchema = z.object({
  variantId: z.string(),
  productId: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  imageUrl: z.string().nullable(),
  color: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

export const submitOrderSchema = z.object({
  customer: checkoutSchema,
  items: z.array(cartItemSchema).min(1, "O carrinho está vazio"),
});

export type SubmitOrderInput = z.infer<typeof submitOrderSchema>;
