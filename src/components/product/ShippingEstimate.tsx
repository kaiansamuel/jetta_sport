"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface EstimateResult {
  city: string;
  state: string;
  shippingInfo: string | null;
}

export function ShippingEstimate() {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/shipping/estimate?cep=${encodeURIComponent(cep)}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Não foi possível calcular o frete.");
        return;
      }
      setResult(data);
    } catch {
      setError("Não foi possível calcular o frete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-jetta-metal/15 bg-jetta-graphite/40 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-jetta-ice">
        <Truck className="h-4 w-4" />
        Calcular frete estimado
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <Input
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="00000-000"
          inputMode="numeric"
          maxLength={9}
          aria-label="CEP"
        />
        <Button type="submit" variant="ghost" disabled={loading}>
          {loading ? "..." : "Calcular"}
        </Button>
      </form>

      {error && <p className="mt-2 text-sm text-jetta-red">{error}</p>}

      {result && (
        <div className="mt-3 text-sm text-jetta-metal">
          <p>
            Entrega para {result.city} - {result.state}
          </p>
          {result.shippingInfo && <p className="mt-1">{result.shippingInfo}</p>}
        </div>
      )}
    </div>
  );
}
