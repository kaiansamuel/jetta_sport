"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils/format";
import type { Banner } from "@/generated/prisma/client";
import { createBanner, updateBanner, deleteBanner } from "@/app/admin/(protected)/banners/actions";

interface FormState {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonLabel: string;
  buttonLink: string;
  placement: "hero" | "promo";
  displayOrder: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
}

const EMPTY: FormState = {
  title: "",
  subtitle: "",
  imageUrl: "",
  buttonLabel: "",
  buttonLink: "",
  placement: "promo",
  displayOrder: "0",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

function toDatetimeLocal(date: Date | null) {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function BannersManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      imageUrl: banner.imageUrl,
      buttonLabel: banner.buttonLabel ?? "",
      buttonLink: banner.buttonLink ?? "",
      placement: banner.placement === "hero" ? "hero" : "promo",
      displayOrder: String(banner.displayOrder),
      isActive: banner.isActive,
      startsAt: toDatetimeLocal(banner.startsAt),
      endsAt: toDatetimeLocal(banner.endsAt),
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
      const result = editingId ? await updateBanner(editingId, form) : await createBanner(form);
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
    if (!confirm("Excluir este banner?")) return;
    await deleteBanner(id);
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-2">
        {banners.map((banner) => (
          <Card key={banner.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-jetta-ice">{banner.title}</p>
              <p className="text-xs text-jetta-metal">
                {banner.placement} · {banner.isActive ? "ativo" : "inativo"}
                {banner.startsAt && ` · a partir de ${formatDateTime(banner.startsAt)}`}
                {banner.endsAt && ` · até ${formatDateTime(banner.endsAt)}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(banner)}
                aria-label="Editar"
                className="flex h-9 w-9 items-center justify-center text-jetta-metal hover:text-jetta-blue"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(banner.id)}
                aria-label="Excluir"
                className="flex h-9 w-9 items-center justify-center text-jetta-metal hover:text-jetta-red"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
        {banners.length === 0 && (
          <p className="text-sm text-jetta-metal">Nenhum banner cadastrado.</p>
        )}
      </div>

      <Card className="h-fit p-5">
        <p className="text-sm font-semibold text-jetta-ice">
          {editingId ? "Editar banner" : "Novo banner"}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <Input
            placeholder="Subtítulo (opcional)"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          />
          <Input
            placeholder="URL da imagem"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Texto do botão"
              value={form.buttonLabel}
              onChange={(e) => setForm((f) => ({ ...f, buttonLabel: e.target.value }))}
            />
            <Input
              placeholder="Link do botão"
              value={form.buttonLink}
              onChange={(e) => setForm((f) => ({ ...f, buttonLink: e.target.value }))}
            />
          </div>
          <label htmlFor="banner-placement" className="sr-only">
            Posição do banner
          </label>
          <select
            id="banner-placement"
            value={form.placement}
            onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value as "hero" | "promo" }))}
            className="h-11 w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice"
          >
            <option value="promo">Promocional (home)</option>
            <option value="hero">Hero</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="banner-starts-at" className="mb-1 block text-xs text-jetta-metal">
                Início (opcional)
              </label>
              <input
                id="banner-starts-at"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                className="h-11 w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice"
              />
            </div>
            <div>
              <label htmlFor="banner-ends-at" className="mb-1 block text-xs text-jetta-metal">
                Fim (opcional)
              </label>
              <input
                id="banner-ends-at"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                className="h-11 w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-jetta-ice">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4 accent-jetta-blue"
            />
            Ativo
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
