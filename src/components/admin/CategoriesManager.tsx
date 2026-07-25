"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils/slugify";
import type { Category } from "@/generated/prisma/client";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/(protected)/categorias/actions";

interface FormState {
  id?: string;
  name: string;
  slug: string;
  imageUrl: string;
  isActive: boolean;
}

const EMPTY: FormState = { name: "", slug: "", imageUrl: "", isActive: true };

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl ?? "",
      isActive: category.isActive,
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
      const payload = { name: form.name, slug: form.slug, imageUrl: form.imageUrl, isActive: form.isActive };
      const result = editingId
        ? await updateCategory(editingId, payload)
        : await createCategory(payload);
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
    if (!confirm("Excluir esta categoria?")) return;
    const result = await deleteCategory(id);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-2">
        {categories.map((category) => (
          <Card key={category.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-jetta-ice">{category.name}</p>
              <p className="text-xs text-jetta-metal">
                /{category.slug} · {category.isActive ? "ativa" : "inativa"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(category)}
                aria-label="Editar"
                className="flex h-9 w-9 items-center justify-center text-jetta-metal hover:text-jetta-blue"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(category.id)}
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
          {editingId ? "Editar categoria" : "Nova categoria"}
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
            placeholder="URL da imagem (opcional)"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
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
          {error && <p className="text-sm text-jetta-red-text">{error}</p>}
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
