# AGENTS.md

## Contexto do Projeto

Proposta AI e um MicroSaaS de propostas comerciais. O monorepo usa `apps/web` para o frontend Next.js App Router e `apps/api` para o backend NestJS. A stack principal inclui Prisma, PostgreSQL, Supabase Auth, React Hook Form, Zod e shadcn/ui.

## Arquitetura

- O frontend cuida da interface, sessao Supabase, rotas protegidas e envio do access token para a API.
- A API cuida das regras de negocio, validacao, persistencia e isolamento por usuario autenticado.
- O frontend envia o access token como `Authorization: Bearer TOKEN`.
- A API valida o token no Supabase e deriva o usuario autenticado pelo token.
- O Prisma acessa PostgreSQL.
- Cada usuario possui uma unica empresa.
- `User.supabaseUserId` conecta Supabase Auth ao Prisma.
- `Company.userId` e uma relacao 1:1 com `User`.

## Regras de Backend

- Controllers devem ser finos; regras ficam em services.
- Validacao deve ficar em DTOs com `class-validator`.
- Nao usar `any`.
- Nao confiar em `userId` ou `companyId` enviados pelo frontend.
- Sempre derivar usuario pelo token autenticado.
- Filtrar dados pelo usuario autenticado.
- Operacoes sensiveis devem ser idempotentes quando fizer sentido.
- Nao expor tokens, service role, secrets ou headers completos em logs.
- Criar migrations novas; nao editar migrations ja aplicadas.

## Regras de Frontend

- Preservar Next.js App Router.
- Reutilizar shadcn/ui e componentes existentes.
- Usar React Hook Form e Zod em formularios.
- Chamadas HTTP devem ficar em services, nao direto nas paginas.
- Evitar chamadas duplicadas desnecessarias.
- Tratar loading, erro, vazio e sucesso.
- Interface em portugues do Brasil.
- Responsividade obrigatoria.
- Painel administrativo deve ser neutro; cores da empresa apenas em previews e propostas.

## Autenticacao

- Supabase Auth para e-mail/senha e Google.
- Confirmacao de e-mail esta desativada no ambiente atual; nao criar tela pedindo confirmacao.
- Nao salvar access token manualmente em `localStorage`.
- Nao usar service role no frontend.
- Proteger frontend e backend.
- Sincronizar usuario Supabase -> Prisma de forma idempotente.

## Banco Local

- Host: `localhost`
- Porta do host: `5438`
- Database: `proposta_ai`
- Container PostgreSQL interno: `5432`
- URL local: `postgresql://postgres:postgres@localhost:5438/proposta_ai`

## Comandos

```bash
npm install
npm run db:up
npm run db:migrate
npm run db:generate
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run build --workspace api
npm run build --workspace web
```

## Escopo e Qualidade

- Fazer uma feature por execucao.
- Evitar overengineering.
- Manter diff focado.
- Nao atualizar dependencias sem necessidade.
- Nao executar `npm audit fix --force`.
- Preservar a arquitetura existente.
- Explicar alteracoes importantes ao final.

## Entrega Obrigatoria

Toda execucao relevante deve informar: diagnostico, causa do problema, arquivos criados, arquivos alterados, migrations, comandos executados, resultado de lint/typecheck/testes/builds, pendencias reais e como testar manualmente.
