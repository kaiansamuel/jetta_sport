# Jetta Sport

E-commerce de tênis com checkout finalizado pelo WhatsApp (sem gateway de pagamento no MVP). Veja `PRD_Jetta_Sport.md` para o produto completo e `CLAUDE.md` para orientação de arquitetura.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL, Auth.js (admin), Zustand (carrinho), React Hook Form + Zod, Framer Motion, Embla Carousel.

## Setup

### 1. Dependências

```bash
pnpm install
```

O projeto usa Prisma 7, que requer Node 20.19+, 22.12+ ou 24+. Se estiver usando `nvm`, rode `nvm use` (o `.nvmrc` fixa a versão 22.22.1).

### 2. Banco de dados

Crie um banco PostgreSQL (Neon em produção; qualquer Postgres 14+ funciona localmente) e copie `.env.example` para `.env`, preenchendo `DATABASE_URL` e `DIRECT_URL`.

```bash
cp .env.example .env
```

Rode as migrações e o seed:

```bash
pnpm db:migrate
pnpm db:seed
```

O seed cria:
- 1 usuário admin: `admin@jettasport.com.br` / `admin123`
- Configurações da loja (`StoreSettings`), com número de WhatsApp placeholder
- 5 marcas, 5 categorias, 15 produtos com variantes (cor + numeração) e estoque variado (incluindo tamanhos esgotados)
- 2 banners de exemplo

### 3. Storage de imagens (Supabase)

Crie um bucket público no Supabase Storage (`SUPABASE_STORAGE_BUCKET`, padrão `jetta-sport-media`) e preencha `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `NEXT_PUBLIC_SUPABASE_URL` no `.env`. Necessário a partir da Fase 4 (upload de imagens pelo painel admin); as imagens do catálogo semeado usam `picsum.photos` como placeholder até lá.

### 4. Autenticação do admin

Gere um `AUTH_SECRET`:

```bash
npx auth secret
```

### 5. Rodar em desenvolvimento

```bash
pnpm dev
```

- Loja: [http://localhost:3000](http://localhost:3000)
- Painel admin: [http://localhost:3000/admin](http://localhost:3000/admin) (login com as credenciais do seed)

## Scripts

| Script | Descrição |
|---|---|
| `pnpm dev` | servidor de desenvolvimento |
| `pnpm build` / `pnpm start` | build e start de produção |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm db:migrate` | aplica migrações Prisma (dev) |
| `pnpm db:seed` | popula o banco com dados de demonstração |
| `pnpm db:studio` | abre o Prisma Studio |
| `pnpm db:reset` | reseta o banco e reaplica migrações |
| `pnpm test` | testes unitários (Vitest) |
| `pnpm test:e2e` | testes end-to-end (Playwright) |

## Segurança

- Sessão do admin via cookie `httpOnly`; `Secure` é adicionado automaticamente pelo Auth.js quando servido em produção sob HTTPS (não aparece em `http://localhost` durante o desenvolvimento — isso é esperado).
- Senha do admin com hash `bcrypt`.
- Rate limiting best-effort (em memória, por processo — não é uma garantia distribuída) em `submitOrder` (5 pedidos / 10 min por telefone) e no login do admin (5 tentativas / 5 min por e-mail). Reseta a cada cold start/redeploy; se precisar de proteção real contra abuso em produção, migre para Upstash Redis.
- Textos livres (políticas, observação do pedido) são renderizados como texto simples pelo React, que escapa HTML automaticamente — não há `dangerouslySetInnerHTML` com conteúdo de usuário em nenhum ponto do app.
- Segredos (`SUPABASE_SERVICE_ROLE_KEY`, `AUTH_SECRET`, `DATABASE_URL`) só são referenciados em código server-only (Server Actions, Route Handlers, `lib/db`, `lib/storage`) — nunca em componentes `"use client"` nem em variáveis `NEXT_PUBLIC_*`.
- Backup do banco: em produção (Neon), use o point-in-time restore nativo do Neon. Não há backup adicional configurado neste repositório.

## Testes

- `pnpm test` — Vitest, cobre `buildOrderMessage` (formato exato do §11.3 do PRD) e outros helpers puros.
- `pnpm test:e2e` — Playwright. No Linux, os navegadores exigem dependências de sistema: `npx playwright install --with-deps chromium` (pede sudo).
- Verificações adicionais feitas manualmente durante o desenvolvimento (não fazem parte do `pnpm test` por dependerem do banco/sessão real): fluxo completo de checkout via Server Action contra o banco, CRUD do painel admin, e varredura de acessibilidade com `@axe-core/playwright` em todas as páginas — 0 violações WCAG 2A/2AA encontradas na última execução.

## Roadmap

O desenvolvimento segue as 5 fases do PRD (`§26`): Fundação → Loja → Conversão → Administração → Qualidade. Veja `CLAUDE.md` para o detalhamento técnico de cada fase.
