# EventManager

Aplicação fullstack para **gerenciamento de eventos e participantes**: permite
cadastrar participantes, criar eventos e inscrever participantes em eventos, com
listagem paginada, busca e controle de acesso por autenticação.

O projeto está dividido em dois pacotes independentes:

| Pasta  | Descrição                                                            |
| ------ | ------------------------------------------------------------------- |
| `api/` | API REST (Node + Express + Prisma + PostgreSQL)                     |
| `web/` | Front-end (Next.js App Router) que consome a API via um BFF interno |

---

## Sumário

- [Tecnologias](#tecnologias)
- [Arquitetura e decisões técnicas](#arquitetura-e-decisões-técnicas)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Instalação e execução](#instalação-e-execução)
- [Executando os testes](#executando-os-testes)
- [Endpoints da API](#endpoints-da-api)
- [Modelo de dados](#modelo-de-dados)
- [Pontos de melhoria futura](#pontos-de-melhoria-futura)

---

## Tecnologias

**Back-end**
- Node.js + TypeScript
- Express 5
- PostgreSQL + Prisma (ORM e migrations)
- Zod (validação de entrada)
- JWT + bcrypt (autenticação)
- Vitest + Supertest (testes)
- Swagger UI (documentação da API em `/docs`)
- Biome (lint/format)

**Front-end**
- React 19 + Next.js 16 (App Router) + TypeScript
- Axios (camada de acesso à API)
- Zustand (estado de sessão no client)
- React Hook Form + Zod (formulários e validação)
- Tailwind CSS (estilos, sem biblioteca de componentes pronta)
- Vitest + Testing Library

---

## Arquitetura e decisões técnicas

### Back-end — separação de responsabilidades

Cada módulo de domínio é organizado em camadas, mantendo a **regra de negócio fora
dos controllers**:

```
api/src/
├── modules/
│   ├── auth/           # registro, login e sessão
│   ├── events/         # CRUD de eventos
│   ├── participants/   # cadastro/consulta de participantes
│   └── registrations/  # inscrição de participantes em eventos
│       ├── *.routes.ts       # definição de rotas + middlewares
│       ├── *.controller.ts   # entrada/saída HTTP (fino)
│       ├── *.service.ts       # regras de negócio
│       ├── *.repository.ts   # acesso a dados (Prisma)
│       ├── *.schema.ts       # schemas Zod (validação/tipos)
│       └── *.mapper.ts       # serialização para respostas públicas
├── shared/             # middlewares, erros, auth, paginação, utils
├── config/             # validação das variáveis de ambiente
└── docs/openapi.yaml   # especificação servida em /docs
```

- **Validação**: todo dado de entrada (body, params, query) passa por schemas Zod
  no middleware `validate`.
- **Tratamento de erros centralizado**: erros de domínio herdam de `AppError` e são
  convertidos por um error handler único no formato padronizado
  `{ "error": "EVENT_NOT_FOUND", "message": "Evento não encontrado" }`.
- **Paginação**: `GET /events` aceita `?page=&limit=` e responde com `data` + `meta`
  (`total`, `page`, `limit`, `totalPages`). Sem esses parâmetros, retorna a lista
  completa.
- **Integridade**: constraint única `(name, date)` em eventos e `(event_id,
  participant_id)` em inscrições garantem as regras mesmo sob concorrência, além da
  validação na camada de serviço.

### Front-end — BFF com cookie httpOnly

O front-end **não fala diretamente com a API a partir do browser**. Ele usa Route
Handlers do Next (em `web/src/app/api/*`) como um **BFF/proxy**: o JWT é guardado em
um **cookie httpOnly** (inacessível ao JavaScript do cliente), e as rotas internas
encaminham as chamadas para a API anexando o token. Rotas protegidas
(`/events/new`, `/events/[id]/edit`, `/profile`) são guardadas por um middleware que
redireciona para `/login`. Essa escolha melhora a segurança (evita XSS roubar o
token) e mantém o estado de sessão hidratado no servidor.

### Interpretação de "participante" (decisão importante)

O desafio descreve `POST /participants` (com `name`, `email`, `phone`) e uma
inscrição via `POST /events/:eventId/participants` recebendo `{ "participantId": 1 }`.
Neste projeto, essa modelagem foi **estendida**: o *participante* também é o
**usuário autenticado** do sistema. As implicações:

- O cadastro de participante é feito por **`POST /auth/register`**, que além de
  `name`, `email` e `phone` recebe uma `password` (a tabela `participants` ganhou a
  coluna `password`, armazenada com hash bcrypt).
- A inscrição (`POST /events/:eventId/participants`) **não recebe `participantId` no
  corpo**: inscreve o **próprio usuário autenticado** (derivado do token). Isso evita
  que alguém inscreva terceiros sem consentimento e simplifica o fluxo de uso real.
- Eventos passam a ter **dono** (`created_by_id`): apenas o criador pode editar ou
  remover o próprio evento (retorna `403` caso contrário).
- **Privacidade de contato**: e-mail e telefone dos inscritos (e do organizador) só
  são expostos ao **dono do evento**. Visitantes e demais participantes veem apenas
  `id` e `name` na listagem de inscritos e no detalhe do evento.

**Motivação**: sem autenticação, qualquer um poderia editar/excluir eventos alheios
ou inscrever terceiros, o que não reflete um sistema de gerenciamento real. As regras
funcionais do desafio (nome/data obrigatórios, data futura, sem duplicidade de evento
e sem inscrição duplicada) continuam todas atendidas. Consulte a seção
[Endpoints da API](#endpoints-da-api) para os contratos exatos.

---

## Pré-requisitos

- **Node.js 20+** e npm
- **Docker** e **Docker Compose** (para subir o PostgreSQL) — ou um PostgreSQL local

---

## Variáveis de ambiente

Cada pacote tem seu próprio `.env.example`. Copie-o para `.env` (API) e `.env.local`
(web) antes de rodar.

**API — `api/.env`** (baseado em [`api/.env.example`](api/.env.example)):

| Variável         | Obrigatória | Descrição                                            |
| ---------------- | ----------- | ---------------------------------------------------- |
| `DATABASE_URL`   | sim         | String de conexão do PostgreSQL                      |
| `PORT`           | não (3333)  | Porta da API                                         |
| `NODE_ENV`       | não (development) | `development` \| `test` \| `production`        |
| `JWT_SECRET`     | **sim**     | Segredo para assinar os tokens JWT                   |
| `JWT_EXPIRES_IN` | não (7d)    | Validade do token (ex.: `7d`, `12h`, `3600`)         |

**Web — `web/.env.local`** (baseado em [`web/.env.example`](web/.env.example)):

| Variável              | Descrição                        |
| --------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base da API (ex.: `http://localhost:3333`) |

---

## Instalação e execução

### 1. Subir o banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe um PostgreSQL 17 em `localhost:5432` (db `eventmanager`, usuário/senha
`postgres`/`postgres`, conforme o `docker-compose.yml`).

### 2. Back-end (`api/`)

```bash
cd api
cp .env.example .env          # ajuste os valores se necessário
npm install                   # instala deps e gera o Prisma Client (postinstall)
npx prisma migrate deploy     # aplica as migrations no banco
npm run dev                   # sobe a API em http://localhost:3333
```

- Documentação interativa (Swagger): **http://localhost:3333/docs**
- Health check: **http://localhost:3333/health**

### 3. Front-end (`web/`)

Em outro terminal:

```bash
cd web
cp .env.example .env.local     # NEXT_PUBLIC_API_URL apontando para a API
npm install
npm run dev                    # sobe a web em http://localhost:3000
```

Acesse **http://localhost:3000**. Crie uma conta em `/register`, faça login e
comece a criar eventos e se inscrever.

---

## Executando os testes

### Back-end

Os testes de integração usam Supertest contra o app Express e um **banco de testes
dedicado** (`eventmanager_test`), que é **criado e migrado automaticamente** — basta
o PostgreSQL do Docker estar no ar.

```bash
cd api
npm test          # roda uma vez
npm run test:watch
```

Cobrem os fluxos obrigatórios: cadastro de evento, cadastro de participante,
inscrição em evento e **bloqueio de inscrição duplicada** (além de autenticação,
permissões de dono e validações).

### Front-end

```bash
cd web
npm test
```

Cobrem os formulários de criação de evento e o botão de inscrição.

---

## Endpoints da API

Base URL: `http://localhost:3333`. Rotas marcadas com 🔒 exigem
`Authorization: Bearer <token>`.

| Método   | Rota                                   | Auth | Descrição                                      |
| -------- | -------------------------------------- | ---- | ---------------------------------------------- |
| `POST`   | `/auth/register`                       |      | Cadastra participante e retorna token          |
| `POST`   | `/auth/login`                          |      | Autentica e retorna token                      |
| `GET`    | `/auth/me`                             | 🔒   | Dados do participante autenticado              |
| `GET`    | `/participants`                        |      | Lista participantes (paginado)                 |
| `PUT`    | `/participants/:id`                    | 🔒   | Atualiza o próprio cadastro                    |
| `DELETE` | `/participants/:id`                    | 🔒   | Remove o próprio cadastro                      |
| `POST`   | `/events`                              | 🔒   | Cria evento (nome/data obrigatórios, data futura, sem duplicar) |
| `GET`    | `/events`                              |      | Lista eventos com busca (`?search=`) e paginação (`?page=&limit=`) + contagem de inscritos |
| `GET`    | `/events/:eventId`                     | 🔓   | Detalhe do evento + inscritos (contato só para o dono) |
| `PUT`    | `/events/:eventId`                     | 🔒   | Edita o evento (apenas o dono)                 |
| `DELETE` | `/events/:eventId`                     | 🔒   | Remove o evento (apenas o dono)                |
| `POST`   | `/events/:eventId/participants`        | 🔒   | Inscreve o **usuário autenticado** no evento   |
| `GET`    | `/events/:eventId/participants`        | 🔓   | Lista os inscritos (contato só para o dono)    |
| `DELETE` | `/events/:eventId/participants/:participantId` | 🔒 | Cancela inscrição (próprio ou dono do evento) |

> 🔓 = autenticação **opcional**: a rota é pública, mas o retorno muda quando um
> token válido é enviado. Nesses endpoints, os dados de contato (email/telefone)
> dos inscritos e do organizador só são retornados quando o solicitante é o **dono
> do evento**; visitantes e não-donos recebem apenas `id` e `name`.

Exemplo de resposta de erro (formato padronizado):

```json
{ "error": "EVENT_NOT_FOUND", "message": "Evento não encontrado" }
```

---

## Modelo de dados

- **participants** — `id`, `name`, `email` (único), `phone`, `password`, `created_at`, `updated_at`
- **events** — `id`, `name`, `description`, `date`, `created_by_id` (FK → participants), `created_at`, `updated_at` — único por `(name, date)`
- **event_participants** — `id`, `event_id` (FK), `participant_id` (FK), `created_at` — único por `(event_id, participant_id)`

Chaves estrangeiras com `ON DELETE CASCADE` e índices nas colunas de junção. Ver
[`api/prisma/schema.prisma`](api/prisma/schema.prisma) e a migration inicial.

O telefone é **normalizado** (apenas dígitos, 10–11) antes de persistir, garantindo
formato consistente.

---
