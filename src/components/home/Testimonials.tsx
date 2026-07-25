import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TESTIMONIALS, SOCIAL_PROOF_STATS } from "@/lib/constants/testimonials";

export function Testimonials({ instagramUrl }: { instagramUrl?: string | null }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-2xl font-bold text-jetta-ice">
          Quem compra, recomenda
        </h2>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-sm text-jetta-metal">
          <span>
            <strong className="text-jetta-ice">{SOCIAL_PROOF_STATS.ordersDelivered}</strong>{" "}
            pedidos entregues
          </span>
          <span>
            <strong className="text-jetta-ice">{SOCIAL_PROOF_STATS.citiesServed}</strong>{" "}
            cidades atendidas
          </span>
          <span>
            <strong className="text-jetta-ice">{SOCIAL_PROOF_STATS.averageRating}</strong> nota
            média
          </span>
          {instagramUrl && (
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-jetta-blue-text hover:underline"
            >
              Ver no Instagram
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <Card key={testimonial.name} className="p-6">
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < testimonial.rating
                      ? "h-4 w-4 fill-jetta-gold text-jetta-gold"
                      : "h-4 w-4 text-jetta-metal/40"
                  }
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-jetta-ice">“{testimonial.comment}”</p>
            <p className="mt-4 text-xs text-jetta-metal">
              {testimonial.name} · {testimonial.city}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
