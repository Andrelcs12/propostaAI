# Criando um novo SaaS

Use este repositorio como ponto de partida para um novo produto da Novely.

## Passos

1. No GitHub, clique em `Use this template`.
2. Escolha o nome do novo produto.
3. Clone o novo repositorio.
4. Instale dependencias com `npm install`.
5. Crie um projeto Supabase para o produto.
6. Copie `.env.example` para `.env`.
7. Configure as variaveis.
8. Execute `npm run db:generate` e `npm run db:migrate`.
9. Rode `npm run dev`.

## O que adaptar primeiro

- Nome textual da marca em `apps/web/src/config/landing.ts`.
- Textos visiveis da landing.
- Metadados em `apps/web/src/app/layout.tsx`.
- URLs de deploy.

## O que nao adicionar antes da validacao

Nao adicione workspace, multi-tenancy, equipe, permissoes, upload, auditoria ou assinatura completa antes de existir necessidade real do produto.
