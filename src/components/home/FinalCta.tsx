import { Button } from "@/components/ui/Button";
import { buildWaLink } from "@/lib/whatsapp/waLink";

export function FinalCta({
  storeName,
  whatsappNumber,
}: {
  storeName: string;
  whatsappNumber: string;
}) {
  const waLink = buildWaLink(
    whatsappNumber,
    `Olá, ${storeName}! Já escolhi meu tênis e quero finalizar o pedido.`,
  );

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
      <h2 className="font-display text-3xl font-bold text-jetta-ice sm:text-4xl">
        Já escolheu seu próximo tênis?
      </h2>
      <p className="mt-3 text-jetta-metal">
        Monte seu pedido e finalize com nosso atendimento pelo WhatsApp.
      </p>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
        <Button variant="whatsapp" size="lg">
          Finalizar pelo WhatsApp
        </Button>
      </a>
    </section>
  );
}
