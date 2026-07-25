import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "Tênis selecionados para quem busca estilo, desempenho e presença. Monte seu pedido e finalize pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jetta Sport",
    template: "%s | Jetta Sport",
  },
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Jetta Sport",
    title: "Jetta Sport",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jetta Sport",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${orbitron.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-jetta-black text-jetta-ice">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
