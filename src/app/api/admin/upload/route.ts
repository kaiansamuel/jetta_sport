import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isSupabaseConfigured, uploadImage } from "@/lib/storage/supabase";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Upload de imagem indisponível: configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env. Por enquanto, cole a URL da imagem diretamente.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "products";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Envie apenas arquivos de imagem." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagem muito grande (máx. 5MB)." }, { status: 400 });
  }

  try {
    const url = await uploadImage(file, folder);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Falha ao enviar a imagem." }, { status: 500 });
  }
}
