"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators/checkout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/store/cartStore";
import { submitOrder } from "@/app/(store)/checkout/actions";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm text-jetta-metal">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-jetta-red-text">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm({ items }: { items: CartItem[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema) });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`/api/shipping/estimate?cep=${cep}`);
      const data = await response.json();
      if (response.ok) {
        setValue("city", data.city);
        setValue("state", data.state);
        setValue("neighborhood", data.neighborhood);
      }
    } catch {
      // Silent: CEP auto-fill is a convenience, not a required step.
    } finally {
      setCepLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const result = await submitOrder({ customer: data, items });
      if (result.error) {
        setServerError(result.error);
        return;
      }
      if (result.orderCode && result.whatsappUrl) {
        // The cart is cleared on the confirmation page, not here — clearing
        // it on this page would flip items.length to 0 while /checkout is
        // still mounted, racing its own "redirect to /carrinho if empty"
        // effect (see checkout/page.tsx).
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
        router.push(`/checkout/confirmacao/${result.orderCode}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field id="customerName" label="Nome completo" error={errors.customerName?.message}>
        <Input id="customerName" autoComplete="name" {...register("customerName")} />
      </Field>

      <Field id="phone" label="Telefone / WhatsApp" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          {...register("phone")}
        />
      </Field>

      <Field id="zipCode" label="CEP" error={errors.zipCode?.message}>
        <Input
          id="zipCode"
          inputMode="numeric"
          placeholder="00000-000"
          autoComplete="postal-code"
          {...register("zipCode", { onBlur: handleCepBlur })}
        />
        {cepLoading && <p className="mt-1 text-xs text-jetta-metal">Buscando endereço...</p>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="city" label="Cidade">
          <Input id="city" autoComplete="address-level2" {...register("city")} />
        </Field>
        <Field id="state" label="Estado">
          <Input id="state" autoComplete="address-level1" {...register("state")} />
        </Field>
      </div>

      <Field id="neighborhood" label="Bairro (opcional)">
        <Input id="neighborhood" {...register("neighborhood")} />
      </Field>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <Field id="address" label="Endereço (opcional)">
          <Input id="address" autoComplete="street-address" {...register("address")} />
        </Field>
        <Field id="addressNumber" label="Número">
          <Input id="addressNumber" className="w-24" {...register("addressNumber")} />
        </Field>
      </div>

      <Field id="complement" label="Complemento (opcional)">
        <Input id="complement" {...register("complement")} />
      </Field>

      <Field id="deliveryType" label="Forma de entrega (opcional)">
        <Input
          id="deliveryType"
          placeholder="Ex: Retirada, entrega expressa..."
          {...register("deliveryType")}
        />
      </Field>

      <Field id="notes" label="Observação (opcional)">
        <textarea
          id="notes"
          rows={3}
          {...register("notes")}
          className="w-full rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-4 py-2 text-sm text-jetta-ice placeholder:text-jetta-metal focus:border-jetta-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-jetta-blue/50"
        />
      </Field>

      {serverError && (
        <p role="alert" className="text-sm text-jetta-red-text">
          {serverError}
        </p>
      )}

      <Button type="submit" variant="whatsapp" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Enviando..." : "Finalizar pelo WhatsApp"}
      </Button>
    </form>
  );
}
