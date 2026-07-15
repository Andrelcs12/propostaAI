# Deploy

## Frontend na Vercel

1. Crie um projeto na Vercel.
2. Selecione `apps/web` como root directory.
3. Configure:

```text
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

4. Use build command:

```bash
npm run build --workspace web
```

## API no Render

1. Crie um Web Service no Render.
2. Configure `apps/api` como servico da API.
3. Configure:

```text
WEB_URL
API_URL
DATABASE_URL
DIRECT_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
```

4. Build command:

```bash
npm ci && npm run db:generate && npm run build --workspace api
```

5. Start command:

```bash
npm run start --workspace api
```

## Supabase

No Supabase, configure a URL publica da Vercel em Authentication > URL Configuration. Para Google OAuth, configure tambem as URLs autorizadas no Google Cloud e no provider do Supabase.

## CI

O GitHub Actions valida lint, typecheck, testes, build e Prisma generate. Ele nao faz deploy automatico.
