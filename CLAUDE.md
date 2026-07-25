# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is currently **pre-implementation**. It contains no application code yet — only:

- `PRD_Jetta_Sport.md` — the full product requirements document (in Portuguese). This is the source of truth for the product and must be read in full before scaffolding or building anything.
- `logo_jetta_sport.jpeg` — brand logo asset.
- `plano_de_fundo_whatsapp.png` — background image referenced by the PRD as the visual reference for the homepage hero.

There is no `package.json`, no build tooling, and no test suite yet. Do not invent commands (`npm run dev`, `npm test`, etc.) until the project has actually been scaffolded — check for a `package.json` first.

## What this project is

**Jetta Sport** is an e-commerce site for selling sneakers online. The distinguishing feature: **there is no in-site payment gateway in the MVP**. Checkout works by having the customer assemble a cart, then the site generates a structured order message and opens WhatsApp (`wa.me`) with it pre-filled; the sales rep confirms stock, shipping, and payment manually over WhatsApp. The order must be persisted in the database *before* the WhatsApp link is opened, so abandoned orders are still trackable.

Visual identity is a "futuristic/premium" sportswear aesthetic (neon, metallic, electric blue + gold + wine red on near-black), not a generic e-commerce template — see PRD section 6 for the full palette, typography (Orbitron for headings, Inter for body), and motion language.

## Recommended stack (per PRD section 14)

The PRD specifies and recommends, for the fastest MVP path:

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, Zustand (cart state), Embla Carousel, Lucide icons.
- **Backend**: full-stack Next.js — Server Actions + Route Handlers, Prisma ORM, PostgreSQL. (The PRD also lists a separated NestJS backend as an alternative, but recommends full-stack Next.js to reduce complexity for the first release.)
- **Image storage**: Cloudinary, Supabase Storage, or S3-compatible.
- **Auth**: Auth.js or Supabase Auth (for the admin panel only — the storefront requires no customer login/account).
- **Hosting**: Vercel (app), Neon/Supabase/Railway (Postgres).

If asked to scaffold the project, follow this stack unless the user directs otherwise.

## Intended architecture (per PRD section 15)

The PRD lays out a route-group structure separating the public storefront from the admin panel:

```
src/
├── app/
│   ├── (store)/        # public storefront: home, catalogo, produto/[slug], carrinho,
│   │                    checkout, promocoes, lancamentos, marcas, sobre, trocas, privacidade
│   ├── admin/           # protected admin panel: produtos, pedidos, categorias, marcas,
│   │                    banners, configuracoes
│   └── api/
├── components/
│   ├── layout/ home/ product/ cart/ checkout/ admin/ ui/
├── lib/
│   ├── db/ whatsapp/ validators/ analytics/ utils/
├── store/               # Zustand stores (cart, etc.)
├── hooks/
├── types/
├── styles/
└── public/
```

## Core domain model (per PRD section 13)

Two entities anchor the schema. Stock is tracked per **variant** (color × size combination), not per product:

- `Product` — has `variants: ProductVariant[]`, `images`, pricing (`price`, optional `promotionalPrice`), and boolean flags `isFeatured` / `isNew` / `isPromotion` / `isActive`.
- `ProductVariant` — `productId`, `color`, `size`, `stock`. A product cannot be added to the cart without a size selected; a variant with zero stock must render disabled.
- `Order` / `OrderItem` — captures the customer's info (name, phone, optional address), a generated order `code`, `status` (see the status enum in PRD section 12), and `whatsappSentAt` for tracking when/whether the WhatsApp handoff actually happened (this is how abandoned orders are distinguished from completed ones).

See PRD section 13 for the full TypeScript interfaces — treat them as the Prisma schema starting point.

## Key business rules to preserve

- No payment gateway integration in the MVP (explicitly out of scope — see PRD section 25).
- Cart must work without login and persist across page reloads (client-side storage).
- A product cannot be added to cart without selecting a size; out-of-stock sizes render disabled, not hidden.
- The order must be saved to the database *before* the `wa.me` link opens, so partial/abandoned checkouts are still visible in the admin panel.
- The WhatsApp destination number, the default order message template, store settings, and banners must all be editable from the admin panel at runtime — not hardcoded.
- Respect `prefers-reduced-motion` for all animations; keep animations in the 150–700ms range and avoid animating many elements simultaneously (PRD section 17).
- Mobile-first responsive design; breakpoints: mobile <640px, tablet 640–1023px, desktop 1024–1439px, large desktop ≥1440px (PRD section 18).

## Where to look for detail

The PRD is organized by numbered section — consult it directly rather than re-deriving details already specified there:

- §6: visual identity (palette, typography, motion direction)
- §7: page-by-page visual concepts (header, hero, category grid, featured products, launches carousel, promo banner, brands marquee, social proof, final CTA)
- §8–§11: catalog page, product page, cart, WhatsApp checkout flow (including the exact generated message format)
- §12: admin panel scope (dashboard metrics, product/order/banner management, settings)
- §19–§23: SEO, performance targets (Lighthouse ≥85 mobile perf / ≥90 a11y/best-practices/SEO), accessibility, security, and analytics event tracking requirements
- §26: suggested phased roadmap (Foundation → Store → Conversion → Admin → Quality)
