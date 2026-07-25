import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import Script from "next/script";
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

// Runs before paint so a stored "light" preference doesn't flash the dark
// theme first — dark is the default (no data-theme attribute), so this only
// ever has to act to switch TO light, never to confirm dark.
const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem("jetta-theme")==="light"){document.documentElement.dataset.theme="light";}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${orbitron.variable} ${inter.variable} h-full antialiased`}
      // The theme-init script (below) sets data-theme from localStorage
      // before hydration for returning light-mode users — server-rendered
      // HTML never has it, so this attribute is *expected* to differ.
      // suppressHydrationWarning tells React that's fine instead of
      // discarding and re-rendering the whole tree over one intentional,
      // client-only attribute.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-jetta-black text-jetta-ice">
        {/* beforeInteractive is the strategy next/script documents for
            exactly this "set an attribute before hydration to avoid a
            theme flash" case — a raw <script> in a hand-written App Router
            <head> is NOT guaranteed to execute before hydration, since
            Next's metadata system manages <head> separately. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
