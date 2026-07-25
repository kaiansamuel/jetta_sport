import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/constants/faq";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  alternates: { canonical: "/perguntas-frequentes" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-jetta-ice sm:text-3xl">
        Perguntas frequentes
      </h1>

      <div className="mt-8 divide-y divide-jetta-metal/15">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-jetta-ice group-hover:text-jetta-blue">
              {item.question}
            </summary>
            <p className="mt-2 text-sm text-jetta-metal">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
