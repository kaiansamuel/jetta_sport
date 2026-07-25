"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUploader, type UploaderImage } from "@/components/admin/ImageUploader";
import { StockManager, type VariantRow } from "@/components/admin/StockManager";
import { slugify } from "@/lib/utils/slugify";
import { createProduct, updateProduct } from "@/app/admin/(protected)/produtos/actions";
import { createBrand } from "@/app/admin/(protected)/marcas/actions";
import { createCategory } from "@/app/admin/(protected)/categorias/actions";

interface OptionItem {
  id: string;
  name: string;
}

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  brandId: string;
  categoryId: string;
  gender: string;
  style: string;
  material: string;
  price: string;
  promotionalPrice: string;
  isFeatured: boolean;
  isNew: boolean;
  isPromotion: boolean;
  isActive: boolean;
  displayOrder: string;
  images: UploaderImage[];
  variants: VariantRow[];
}

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  shortDescription: "",
  brandId: "",
  categoryId: "",
  gender: "unissex",
  style: "",
  material: "",
  price: "",
  promotionalPrice: "",
  isFeatured: false,
  isNew: false,
  isPromotion: false,
  isActive: true,
  displayOrder: "0",
  images: [],
  variants: [],
};

export function ProductForm({
  mode,
  initialValues,
  brands: initialBrands,
  categories: initialCategories,
}: {
  mode: "create" | "edit";
  initialValues: ProductFormValues;
  brands: OptionItem[];
  categories: OptionItem[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const [brands, setBrands] = useState(initialBrands);
  const [categories, setCategories] = useState(initialCategories);
  const [newBrandName, setNewBrandName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) return;
    const result = await createBrand({
      name: newBrandName,
      slug: slugify(newBrandName),
      isActive: true,
    });
    if (result.error || !result.brand) {
      setError(result.error ?? "Falha ao criar marca.");
      return;
    }
    setBrands((prev) => [...prev, { id: result.brand.id, name: result.brand.name }]);
    setForm((f) => ({ ...f, brandId: result.brand.id }));
    setNewBrandName("");
    setShowNewBrand(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    const result = await createCategory({
      name: newCategoryName,
      slug: slugify(newCategoryName),
      isActive: true,
    });
    if (result.error || !result.category) {
      setError(result.error ?? "Falha ao criar categoria.");
      return;
    }
    setCategories((prev) => [...prev, { id: result.category.id, name: result.category.name }]);
    setForm((f) => ({ ...f, categoryId: result.category.id }));
    setNewCategoryName("");
    setShowNewCategory(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      description: form.description,
      shortDescription: form.shortDescription,
      brandId: form.brandId,
      categoryId: form.categoryId,
      gender: form.gender,
      style: form.style,
      material: form.material,
      price: form.price,
      promotionalPrice: form.promotionalPrice,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isPromotion: form.isPromotion,
      isActive: form.isActive,
      displayOrder: form.displayOrder,
      images: form.images,
      variants: form.variants,
    };

    try {
      const result =
        mode === "create"
          ? await createProduct(payload)
          : await updateProduct(form.id!, payload);

      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin/produtos");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="product-name" className="mb-1 block text-sm text-jetta-metal">
            Nome
          </label>
          <Input
            id="product-name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: mode === "create" ? slugify(e.target.value) : f.slug,
              }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="product-slug" className="mb-1 block text-sm text-jetta-metal">
            Slug
          </label>
          <Input
            id="product-slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="product-sku" className="mb-1 block text-sm text-jetta-metal">
            SKU
          </label>
          <Input
            id="product-sku"
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product-short-desc" className="mb-1 block text-sm text-jetta-metal">
            Descrição curta
          </label>
          <Input
            id="product-short-desc"
            value={form.shortDescription}
            onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product-description" className="mb-1 block text-sm text-jetta-metal">
            Descrição completa
          </label>
          <textarea
            id="product-description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            required
            className="w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-4 py-2 text-sm text-jetta-ice focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
          />
        </div>

        <div>
          <label htmlFor="product-brand" className="mb-1 block text-sm text-jetta-metal">
            Marca
          </label>
          <div className="flex gap-2">
            <select
              id="product-brand"
              value={form.brandId}
              onChange={(e) => setForm((f) => ({ ...f, brandId: e.target.value }))}
              required
              className="h-11 flex-1 rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice"
            >
              <option value="">Selecione</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewBrand((v) => !v)}>
              Nova
            </Button>
          </div>
          {showNewBrand && (
            <div className="mt-2 flex gap-2">
              <Input
                aria-label="Nome da nova marca"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Nome da marca"
              />
              <Button type="button" size="sm" onClick={handleCreateBrand}>
                Criar
              </Button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="product-category" className="mb-1 block text-sm text-jetta-metal">
            Categoria
          </label>
          <div className="flex gap-2">
            <select
              id="product-category"
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              required
              className="h-11 flex-1 rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice"
            >
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewCategory((v) => !v)}>
              Nova
            </Button>
          </div>
          {showNewCategory && (
            <div className="mt-2 flex gap-2">
              <Input
                aria-label="Nome da nova categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da categoria"
              />
              <Button type="button" size="sm" onClick={handleCreateCategory}>
                Criar
              </Button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="product-gender" className="mb-1 block text-sm text-jetta-metal">
            Gênero
          </label>
          <select
            id="product-gender"
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            className="h-11 w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice"
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="unissex">Unissex</option>
            <option value="infantil">Infantil</option>
          </select>
        </div>

        <div>
          <label htmlFor="product-style" className="mb-1 block text-sm text-jetta-metal">
            Estilo
          </label>
          <Input
            id="product-style"
            value={form.style}
            onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="product-material" className="mb-1 block text-sm text-jetta-metal">
            Material (opcional)
          </label>
          <Input
            id="product-material"
            value={form.material}
            onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="product-display-order" className="mb-1 block text-sm text-jetta-metal">
            Ordem de exibição
          </label>
          <Input
            id="product-display-order"
            type="number"
            value={form.displayOrder}
            onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="product-price" className="mb-1 block text-sm text-jetta-metal">
            Preço (R$)
          </label>
          <Input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="product-promo-price" className="mb-1 block text-sm text-jetta-metal">
            Preço promocional (opcional)
          </label>
          <Input
            id="product-promo-price"
            type="number"
            step="0.01"
            min="0"
            value={form.promotionalPrice}
            onChange={(e) => setForm((f) => ({ ...f, promotionalPrice: e.target.value }))}
          />
        </div>

        <div className="flex flex-wrap gap-4 sm:col-span-2">
          {(
            [
              ["isFeatured", "Destaque"],
              ["isNew", "Lançamento"],
              ["isPromotion", "Promoção"],
              ["isActive", "Ativo"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-jetta-ice">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                className="h-4 w-4 accent-jetta-blue"
              />
              {label}
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <p className="mb-3 text-sm font-semibold text-jetta-ice">Imagens</p>
        <ImageUploader images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
      </Card>

      <Card className="p-5">
        <p className="mb-3 text-sm font-semibold text-jetta-ice">
          Estoque por cor e numeração
        </p>
        <StockManager
          variants={form.variants}
          onChange={(variants) => setForm((f) => ({ ...f, variants }))}
        />
      </Card>

      {error && <p className="text-sm text-jetta-red-text">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : mode === "create" ? "Criar produto" : "Salvar alterações"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/produtos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
