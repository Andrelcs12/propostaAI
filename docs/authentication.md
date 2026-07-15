# Autenticacao

O template usa Supabase Auth como fonte de autenticacao.

## Frontend

O Next.js executa:

- cadastro com nome, e-mail e senha;
- login com e-mail e senha;
- login com Google;
- recuperacao de senha;
- redefinicao de senha;
- logout;
- persistencia e renovacao de sessao via cookies do Supabase SSR.

Os clientes ficam em:

```text
apps/web/src/lib/supabase/browser.ts
apps/web/src/lib/supabase/server.ts
apps/web/src/lib/supabase/middleware.ts
```

Tokens nao sao salvos em `localStorage`.

## API

A API recebe:

```http
Authorization: Bearer TOKEN
```

O guard `SupabaseAuthGuard` valida o token no Supabase e injeta o usuario autenticado na request. O endpoint `GET /api/users/me` sincroniza o usuario com Prisma usando `upsert` pelo `supabaseUserId`.

## Regras importantes

- Nao existe JWT proprio.
- Nao existe refresh token proprio.
- O frontend nunca envia `userId` confiavel para a API.
- A `SUPABASE_SERVICE_ROLE_KEY` pertence somente ao backend.
