import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-jetta-black px-4">
      <Card className="w-full max-w-sm p-8">
        <h1 className="font-display text-xl font-bold tracking-wide text-jetta-ice">
          Jetta Sport
        </h1>
        <p className="mt-1 mb-6 text-sm text-jetta-metal">
          Painel administrativo
        </p>
        <LoginForm />
      </Card>
    </main>
  );
}
