# Proposta AI

MicroSaaS para freelancers, agencias, desenvolvedores, designers, consultores e pequenos prestadores B2B criarem propostas comerciais profissionais.

Esta base entrega monorepo, landing page, cadastro, login, login com Google, Supabase Auth, usuario persistido com Prisma, onboarding de empresa, painel inicial, API NestJS e estrutura inicial do Stripe sem cobranca real.

## Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Lucide, React Hook Form, Zod, Sonner, Supabase Auth e Geist.
- Backend: NestJS, Fastify, Prisma v7, PostgreSQL, Swagger, Helmet, CORS e ValidationPipe.
- Infra: npm workspaces, Turborepo, Docker Compose para banco local, GitHub Actions, Vercel para web e Render para API.

## Estrutura

```text
apps/web     # Next.js
apps/api     # NestJS
packages/shared
packages/eslint-config
packages/typescript-config
docs
```

## Requisitos

- Node.js 22+
- npm 10+
- Docker Desktop para banco local
- Projeto Supabase
- Conta Google Cloud para OAuth
- Conta Vercel e Render para deploy

## Instalacao

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Preencha as variaveis antes de rodar login, pagamentos ou integracoes externas. Para banco local via Docker, o `DATABASE_URL` padrao ja aponta para `localhost:5438`.

## Variaveis de ambiente

Frontend:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Backend:

- `WEB_URL`
- `API_URL`
- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `PROPOSAL_PRICE_IN_CENTS`

O banco da API vem de `DATABASE_URL`. Em desenvolvimento, use Docker local. Em producao ou staging, pode usar Neon, Supabase Postgres ou outro PostgreSQL gerenciado.

No Supabase, use apenas as variaveis de Auth quando quiser login real. Encontre URL e chaves em Project Settings > API. A `SUPABASE_SERVICE_ROLE_KEY` nunca pode ser exposta no frontend ou em variaveis `NEXT_PUBLIC_*`.

As chaves Stripe podem ficar vazias ate a integracao real ser ativada.

## Docker local

Suba o PostgreSQL local:

```bash
npm run db:up
```

Dados padrao:

- Host: `localhost`
- Porta do host: `5438`
- Database: `proposta_ai`
- Usuario: `postgres`
- Senha: `postgres`
- Porta interna do container: `5432`
- URL: `postgresql://postgres:postgres@localhost:5438/proposta_ai`

Comandos uteis:

```bash
npm run db:logs
npm run db:down
npm run db:admin
```

O `db:admin` sobe o Adminer em `http://localhost:8080`. No Adminer, use servidor `postgres`, usuario `postgres`, senha `postgres` e database `proposta_ai`.

## Supabase

1. Crie um projeto no Supabase.
2. Copie `Project URL` para `SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_URL`.
3. Copie a anon key para `SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copie a service role key somente para `SUPABASE_SERVICE_ROLE_KEY` no backend.
5. Em Authentication > Providers, habilite e-mail/senha.

O PostgreSQL nao precisa ser do Supabase. Se quiser usar Neon ou Docker, basta trocar `DATABASE_URL` e `DIRECT_DATABASE_URL` no `apps/api/.env`.

## Google OAuth

1. Crie credenciais OAuth no Google Cloud.
2. Configure a URL de callback do Supabase no Google.
3. No Supabase, habilite Google em Authentication > Providers.
4. Adicione Client ID e Client Secret no Supabase.
5. Inclua a URL da aplicacao em Authentication > URL Configuration.

## Prisma

```bash
npm run db:up
npm run db:generate
npm run db:migrate
```

O modelo inicial possui apenas `User`, sincronizado com `upsert` pelo `supabaseUserId`.

## Rodando localmente

```bash
npm run db:up
npm run dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/docs`
- Health: `http://localhost:4000/api/health`

## Autenticacao

Cadastro, login, recuperacao, redefinicao de senha e Google OAuth acontecem no frontend via Supabase Auth. A API nao cria login proprio. O frontend envia o access token no header `Authorization: Bearer TOKEN`, e a API valida esse token no Supabase antes de retornar dados.

As rotas `/onboarding`, `/painel` e `/minha-empresa` sao protegidas pelo middleware do Next.js e tambem revalidam a sessao no Server Component.

## Stripe

O Stripe esta em modo estrutural. O backend inicializa o SDK quando `STRIPE_SECRET_KEY` existe e expoe apenas:

```http
GET /api/billing/config
```

Resposta:

```json
{
  "enabled": false,
  "mode": "structure-only"
}
```

Nao ha checkout, portal, webhook, assinatura, customer, price ou product nesta versao.

## Deploy

### Vercel

1. Crie um projeto apontando para `apps/web`.
2. Configure o build command como `npm run build --workspace web`.
3. Configure as variaveis `NEXT_PUBLIC_*`.
4. Configure `NEXT_PUBLIC_API_URL` com a URL publica da API no Render.

### Render

1. Crie um Web Service apontando para `apps/api`.
2. Use Node.js 22+.
3. Build command: `npm ci && npm run db:generate && npm run build --workspace api`.
4. Start command: `npm run start --workspace api`.
5. Configure as variaveis do backend.

## GitHub Template

1. Publique este repositorio no GitHub.
2. Abra Settings > General.
3. Marque `Template repository`.
4. Para criar um novo produto, clique em `Use this template`.

## Comandos principais

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run db:up
npm run db:down
npm run db:generate
```

## Fora do escopo desta versao

Workspace, multi-tenancy, uploads, Storage, Cloudinary, auditoria, notificacoes, equipes, roles, permissoes, assinatura completa, cobranca real e dashboard complexo.
