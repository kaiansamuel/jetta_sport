"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils/slugify";
import type { Brand } from "@/generated/prisma/client";
import { createBrand, updateBrand, deleteBrand } from "@/app/admin/(protected)/marcas/actions";

interface FormState {
  id?: string;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
}

const EMPTY: FormState = { name: "", slug: "", logoUrl: "", isActive: true };

export function BrandsManager({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setForm({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl ?? "",
      isActive: brand.isActive,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { name: form.name, slug: form.slug, logoUrl: form.logoUrl, isActive: form.isActive };
      const result = editingId ? await updateBrand(editingId, payload) : await createBrand(payload);
      if (result.error) {
        setError(result.error);
        return;
      }
      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta marca?")) return;
    const result = await deleteBrand(id);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-2">
        {brands.map((brand) => (
          <Card key={brand.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-jetta-ice">{brand.name}</p>
              <p className="text-xs text-jetta-metal">
                /{brand.slug} · {brand.isActive ? "ativa" : "inativa"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(brand)}
                aria-label="Editar"
                className="flex h-9 w-9 items-center justify-center text-jetta-metal hover:text-jetta-blue"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(brand.id)}
                aria-label="Excluir"
                className="flex h-9 w-9 items-center justify-center text-jetta-metal hover:text-jetta-red"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="h-fit p-5">
        <p className="text-sm font-semibold text-jetta-ice">
          {editingId ? "Editar marca" : "Nova marca"}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input
            placeholder="Nome"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: editingId ? f.slug : slugify(e.target.value),
              }))
            }
            required
          />
          <Input
            placeholder="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
          <Input
            placeholder="URL do logo (opcional)"
            value={form.logoUrl}
            onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm text-jetta-ice">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4 accent-jetta-blue"
            />
            Ativa
          </label>
          {error && <p className="text-sm text-jetta-red">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {editingId ? "Salvar" : (
                <>
                  <Plus className="h-4 w-4" /> Criar
                </>
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
