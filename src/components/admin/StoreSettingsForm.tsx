"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { StoreSettingsInput } from "@/lib/validators/product";
import { updateStoreSettings } from "@/app/admin/(protected)/configuracoes/actions";

export function StoreSettingsForm({ initialValues }: { initialValues: StoreSettingsInput }) {
  const [form, setForm] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof StoreSettingsInput>(key: K, value: StoreSettingsInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const result = await updateStoreSettings(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label htmlFor="settings-store-name" className="mb-1 block text-sm text-jetta-metal">
            Nome da loja
          </label>
          <Input
            id="settings-store-name"
            value={form.storeName}
            onChange={(e) => set("storeName", e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="settings-whatsapp" className="mb-1 block text-sm text-jetta-metal">
            WhatsApp (DDI+DDD+número)
          </label>
          <Input
            id="settings-whatsapp"
            value={form.whatsappNumber}
            onChange={(e) => set("whatsappNumber", e.target.value)}
            placeholder="5511999999999"
            required
          />
        </div>
        <div>
          <label htmlFor="settings-instagram" className="mb-1 block text-sm text-jetta-metal">
            Instagram (opcional)
          </label>
          <Input
            id="settings-instagram"
            value={form.instagramUrl ?? ""}
            onChange={(e) => set("instagramUrl", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="settings-address" className="mb-1 block text-sm text-jetta-metal">
            Endereço (opcional)
          </label>
          <Input
            id="settings-address"
            value={form.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="settings-hours" className="mb-1 block text-sm text-jetta-metal">
            Horário de atendimento (opcional)
          </label>
          <Input
            id="settings-hours"
            value={form.businessHours ?? ""}
            onChange={(e) => set("businessHours", e.target.value)}
          />
        </div>
      </Card>

      <Card className="p-5">
        <label htmlFor="settings-template" className="mb-1 block text-sm text-jetta-metal">
          Template da mensagem do WhatsApp
        </label>
        <p className="mb-2 text-xs text-jetta-metal">
          Placeholders disponíveis: {"{storeName} {code} {items} {subtotal} {customerName} {zipCode} {city} {deliveryType} {notes}"}
        </p>
        <textarea
          id="settings-template"
          value={form.whatsappMessageTemplate}
          onChange={(e) => set("whatsappMessageTemplate", e.target.value)}
          rows={10}
          className="w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-4 py-2 font-mono text-xs text-jetta-ice focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
        />
      </Card>

      <Card className="p-5">
        <label htmlFor="settings-exchange" className="mb-1 block text-sm text-jetta-metal">
          Política de troca
        </label>
        <textarea
          id="settings-exchange"
          value={form.exchangePolicy ?? ""}
          onChange={(e) => set("exchangePolicy", e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-4 py-2 text-sm text-jetta-ice focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
        />
        <label htmlFor="settings-privacy" className="mt-4 mb-1 block text-sm text-jetta-metal">
          Política de privacidade
        </label>
        <textarea
          id="settings-privacy"
          value={form.privacyPolicy ?? ""}
          onChange={(e) => set("privacyPolicy", e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-4 py-2 text-sm text-jetta-ice focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
        />
        <label htmlFor="settings-shipping" className="mt-4 mb-1 block text-sm text-jetta-metal">
          Informações de frete
        </label>
        <textarea
          id="settings-shipping"
          value={form.shippingInfo ?? ""}
          onChange={(e) => set("shippingInfo", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-4 py-2 text-sm text-jetta-ice focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
        />
      </Card>

      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label htmlFor="settings-color" className="mb-1 block text-sm text-jetta-metal">
            Cor primária (opcional)
          </label>
          <Input
            id="settings-color"
            value={form.primaryColor ?? ""}
            onChange={(e) => set("primaryColor", e.target.value)}
            placeholder="#18BFFF"
          />
        </div>
        <div>
          <label htmlFor="settings-logo" className="mb-1 block text-sm text-jetta-metal">
            URL do logo (opcional)
          </label>
          <Input
            id="settings-logo"
            value={form.logoUrl ?? ""}
            onChange={(e) => set("logoUrl", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="settings-favicon" className="mb-1 block text-sm text-jetta-metal">
            URL do favicon (opcional)
          </label>
          <Input
            id="settings-favicon"
            value={form.faviconUrl ?? ""}
            onChange={(e) => set("faviconUrl", e.target.value)}
          />
        </div>
      </Card>

      {error && <p className="text-sm text-jetta-red">{error}</p>}
      {saved && <p className="text-sm text-jetta-cyan">Configurações salvas.</p>}

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}
