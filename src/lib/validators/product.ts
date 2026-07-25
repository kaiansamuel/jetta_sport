import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Informe a cor"),
  size: z.string().min(1, "Informe a numeração"),
  stock: z.coerce.number().int().min(0, "Estoque não pode ser negativo"),
});

export const productImageSchema = z.object({
  url: z.string().min(1, "URL inválida"),
  altText: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2, "Slug obrigatório"),
  sku: z.string().min(1, "SKU obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  shortDescription: z.string().min(1, "Descrição curta obrigatória"),
  brandId: z.string().min(1, "Selecione a marca"),
  categoryId: z.string().min(1, "Selecione a categoria"),
  gender: z.string().min(1, "Informe o gênero"),
  style: z.string().min(1, "Informe o estilo"),
  material: z.string().optional(),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  promotionalPrice: z
    .union([z.coerce.number().positive(), z.literal(""), z.undefined(), z.null()])
    .optional()
    .transform((v) => (v === "" || v == null ? null : v)),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isPromotion: z.boolean(),
  isActive: z.boolean(),
  displayOrder: z.coerce.number().int(),
  images: z.array(productImageSchema).min(1, "Adicione ao menos uma imagem"),
  variants: z.array(productVariantSchema).min(1, "Adicione ao menos uma variante"),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2, "Slug obrigatório"),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const brandSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2, "Slug obrigatório"),
  logoUrl: z.string().optional(),
  isActive: z.boolean(),
});
export type BrandInput = z.infer<typeof brandSchema>;

export const bannerSchema = z.object({
  title: z.string().min(2, "Título obrigatório"),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "Imagem obrigatória"),
  buttonLabel: z.string().optional(),
  buttonLink: z.string().optional(),
  placement: z.enum(["hero", "promo"]),
  displayOrder: z.coerce.number().int(),
  isActive: z.boolean(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});
export type BannerInput = z.infer<typeof bannerSchema>;

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Nome obrigatório"),
  whatsappNumber: z
    .string()
    .min(10, "Informe um número válido com DDI e DDD (ex: 5511999999999)"),
  instagramUrl: z.string().optional(),
  address: z.string().optional(),
  businessHours: z.string().optional(),
  whatsappMessageTemplate: z.string().min(1, "Template obrigatório"),
  exchangePolicy: z.string().optional(),
  privacyPolicy: z.string().optional(),
  shippingInfo: z.string().optional(),
  primaryColor: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
