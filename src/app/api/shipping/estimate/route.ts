import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/db/settings";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawCep = searchParams.get("cep") ?? "";
  const cep = rawCep.replace(/\D/g, "");

  if (cep.length !== 8) {
    return NextResponse.json(
      { error: "CEP inválido. Informe 8 dígitos." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      // ViaCEP data changes rarely; short cache avoids hammering the API
      // during repeated lookups for the same CEP in a session.
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Falha ao consultar o CEP." }, { status: 502 });
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return NextResponse.json({ error: "CEP não encontrado." }, { status: 404 });
    }

    const settings = await getStoreSettings();

    return NextResponse.json({
      city: data.localidade,
      state: data.uf,
      neighborhood: data.bairro,
      shippingInfo: settings.shippingInfo,
    });
  } catch {
    return NextResponse.json({ error: "Falha ao consultar o CEP." }, { status: 502 });
  }
}
