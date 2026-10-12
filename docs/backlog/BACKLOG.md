# Flagpole — Product Backlog

Readable mirror of the Jira backlog. Jira is the source of truth for status; this file keeps the original scope and acceptance criteria public and versioned.

IDs below (101, 102, …) are local planning IDs. Jira assigns the real `FLAG-n` keys on import, and those keys are what go into branches and commits.

## Epics

| # | Epic | Purpose |
|---|---|---|
| E1 | Project foundation & developer experience | Monorepo, tooling, CI and local environment so every later story ships quickly and safely. |
| E2 | Core domain & admin API | Projects, environments and flags managed through a versioned REST API backed by PostgreSQL. |
| E3 | Flag evaluation engine | Pure, deterministic, fully tested evaluation logic shared by the API and every SDK. Hand-written. |
| E4 | Authentication & access control | Secure dashboard users and environment-scoped SDK API keys. |
| E5 | Admin dashboard (Next.js) | Next.js 16 dashboard for managing projects, flags, targeting and rollouts. |
| E6 | SDKs | npm packages that evaluate flags locally (Node.js) and expose them in React. |
| E7 | Delivery, docs & demo | Deployed staging environment, polished README, architecture diagram and demo app. |

## Sprint 1 — Foundation and core engine

**Sprint goal:** A flag can be created through the API and evaluated correctly by a fully tested engine.

**Total:** 20 points

| ID | Epic | Type | Summary | Pts |
|---|---|---|---|---|
| 101 | E1 | Task | Set up pnpm + Turborepo monorepo | 2 |
| 102 | E1 | Task | Local PostgreSQL with Docker Compose | 1 |
| 103 | E1 | Task | CI pipeline with GitHub Actions | 2 |
| 104 | E1 | Task | Spike: choose an ORM (Drizzle vs Prisma) | 1 |
| 105 | E2 | Story | Database schema, migrations and seed data | 3 |
| 106 | E2 | Story | Projects & environments API | 3 |
| 107 | E2 | Story | Flags CRUD API | 3 |
| 108 | E3 | Story | Targeting rule evaluator (hand-written) | 5 |

### 101 · Set up pnpm + Turborepo monorepo

*Task · Epic E1 · 2 pts · Priority Highest · Labels: infra*

Create the workspace with apps/api (NestJS), apps/web (Next.js 16) and packages/shared, with Turborepo pipelines for dev, build, lint, typecheck and test.

**Acceptance criteria**

- [ ] `pnpm install` at the root installs every workspace
- [ ] `pnpm dev` starts api (port 3001) and web (port 3000) in parallel
- [ ] `pnpm build`, `pnpm lint` and `pnpm typecheck` run through Turborepo with caching
- [ ] packages/shared is importable from both apps (proven with one exported constant)
- [ ] Shared tsconfig base, ESLint and Prettier config live at the root
- [ ] ADR-001 explains why a monorepo (written by me)

### 102 · Local PostgreSQL with Docker Compose

*Task · Epic E1 · 1 pts · Priority Highest · Labels: infra*

Reproducible local database for development and integration tests.

**Acceptance criteria**

- [ ] docker-compose.yml runs Postgres with a pinned major version, a named volume and a healthcheck
- [ ] .env.example documents DATABASE_URL and every other variable
- [ ] After `docker compose up -d` the API connects successfully
- [ ] README has a 'Run locally' section

### 103 · CI pipeline with GitHub Actions

*Task · Epic E1 · 2 pts · Priority High · Labels: ci*

Every pull request is verified automatically.

**Acceptance criteria**

- [ ] Workflow runs on pull_request and on push to main
- [ ] Steps: pnpm install (with cache), lint, typecheck, test, build
- [ ] A Postgres service container is available for integration tests
- [ ] main is protected: PR required and CI must pass
- [ ] CI status badge in the README

### 104 · Spike: choose an ORM (Drizzle vs Prisma)

*Task · Epic E1 · 1 pts · Priority High · Labels: spike, adr*

Time-boxed to 2 hours. Model the same two tables (flags + flag_environment_configs with a jsonb column) in both ORMs and compare migration workflow, jsonb typing, raw SQL escape hatch and generated SQL.

**Acceptance criteria**

- [ ] Decision recorded in docs/adr/ADR-002-orm-choice.md, written in my own words
- [ ] Spike code is thrown away, not merged

### 105 · Database schema, migrations and seed data

*Story · Epic E2 · 3 pts · Priority High · Labels: backend, database*

> As a developer working on Flagpole, I want a versioned database schema and seed data so that every environment starts from the same known state.

Tables as described in CLAUDE.md (users, sessions, projects, environments, flags, flag_environment_configs, api_keys).

**Acceptance criteria**

- [ ] All tables created through migrations, with no manual SQL
- [ ] Unique (project_id, key) on flags and on environments
- [ ] Foreign keys have deliberately chosen ON DELETE behavior
- [ ] flag_environment_configs.version and environments.ruleset_version exist for optimistic locking and ETags
- [ ] Migrations and seed each run with one command
- [ ] Seed creates a demo user, a demo project with 3 environments and 3 flags
- [ ] Migrations are applied in CI before tests

### 106 · Projects & environments API

*Story · Epic E2 · 3 pts · Priority High · Labels: backend, api*

> As a team lead, I want a new project to automatically get development, staging and production environments so that I can start defining flags immediately.

Admin API endpoints under /api/v1/projects. Ownership checks are added in the auth story; for now use the seeded user.

**Acceptance criteria**

- [ ] POST /api/v1/projects creates the project plus 3 default environments in a single transaction
- [ ] GET list, GET by id and PATCH name are implemented
- [ ] Keys are lowercase kebab-case, validated with a Zod schema from @flagpole/shared
- [ ] Duplicate key returns 409 Conflict with a clear error body
- [ ] e2e tests with supertest against the test database

### 107 · Flags CRUD API

*Story · Epic E2 · 3 pts · Priority High · Labels: backend, api*

> As a developer, I want to create, list, update and archive feature flags so that I can manage releases without redeploying.

Endpoints under /api/v1/projects/:projectId/flags.

**Acceptance criteria**

- [ ] Creating a flag also creates a disabled config row for every environment, in one transaction
- [ ] Types boolean | string | number | json; variations are validated against the type
- [ ] The flag key is immutable after creation
- [ ] Archiving is a soft delete (archived_at); archived flags are hidden unless ?includeArchived=true
- [ ] List supports pagination and search by key or name
- [ ] e2e tests cover the happy path and validation errors

### 108 · Targeting rule evaluator (hand-written)

*Story · Epic E3 · 5 pts · Priority Highest · Labels: core, hand-written*

> As an application using Flagpole, I want flags evaluated against a user context so that different users can receive different variations.

Lives in packages/shared/src/evaluation. I write the implementation myself; Claude Code only reviews and suggests test cases.

**Acceptance criteria**

- [ ] Pure function evaluate(flag, config, context) returns { value, variationIndex, reason }
- [ ] Reasons: OFF, TARGET_MATCH (with ruleIndex), FALLTHROUGH, ERROR
- [ ] A disabled flag returns the off variation
- [ ] Rules are evaluated in order and the first match wins; all clauses in a rule must match (AND)
- [ ] Operators: equals, notEquals, in, notIn, contains, startsWith, endsWith, greaterThan, lessThan
- [ ] A missing attribute means the clause does not match, and the function never throws
- [ ] At least 95% branch coverage with Vitest
- [ ] Zero runtime dependencies

## Sprint 2 — Auth, SDK and first dashboard

**Sprint goal:** A user logs into the dashboard and sees their flags, and a Node app evaluates those flags locally through the SDK.

**Total:** 22 points

| ID | Epic | Type | Summary | Pts |
|---|---|---|---|---|
| 201 | E3 | Story | Deterministic percentage rollouts (hand-written) | 3 |
| 202 | E4 | Story | Dashboard user authentication | 3 |
| 203 | E4 | Story | Environment-scoped API keys | 3 |
| 204 | E2 | Story | Update flag configuration per environment | 3 |
| 205 | E6 | Story | SDK rules endpoint with ETag | 2 |
| 206 | E6 | Story | Node.js server SDK (polling + local evaluation) | 5 |
| 207 | E5 | Story | Dashboard: login and flag overview | 3 |

### 201 · Deterministic percentage rollouts (hand-written)

*Story · Epic E3 · 3 pts · Priority Highest · Labels: core, hand-written, adr*

> As a product owner, I want to release a feature to a percentage of users so that I limit risk, and each user keeps the same experience on every request.

Rollout = list of { variationIndex, weight } with weights in basis points.

**Acceptance criteria**

- [ ] Weights must sum to 10,000 (validated by the Zod schema)
- [ ] Bucket comes from a stable hash of `${flagKey}.${salt}.${context.key}`
- [ ] The same input always produces the same bucket (test)
- [ ] Distribution test: 100,000 random keys at 25% land within ±1%
- [ ] Raising a rollout from 10% to 20% keeps every user who was already in the 10% (test)
- [ ] A rollout can be used both as the fallthrough and as a rule result
- [ ] ADR-003 explains the hash choice (written by me)

### 202 · Dashboard user authentication

*Story · Epic E4 · 3 pts · Priority Highest · Labels: backend, security*

> As a dashboard user, I want to sign up and log in securely so that only my team can change flags.

Session-based auth owned by the NestJS API.

**Acceptance criteria**

- [ ] Register, login, logout and 'me' endpoints
- [ ] Passwords hashed with argon2id
- [ ] Sessions stored in Postgres (hashed token); cookie is httpOnly, Secure in production, SameSite=Lax
- [ ] A global guard protects /api/v1/*, with a @Public() decorator for exceptions
- [ ] Users can only access projects they own (others return 404)
- [ ] Login is rate-limited
- [ ] e2e tests for the auth flows and for 401/404 cases

### 203 · Environment-scoped API keys

*Story · Epic E4 · 3 pts · Priority High · Labels: backend, security*

> As a developer, I want separate server and client keys per environment so that SDKs can authenticate without having admin access.

Keys look like fp_srv_<random> / fp_cli_<random>.

**Acceptance criteria**

- [ ] Creating a key returns the full key exactly once; only its SHA-256 hash and prefix are stored
- [ ] List shows name, prefix, type, created and last used
- [ ] Revoking sets revoked_at, and revoked keys are rejected immediately
- [ ] An ApiKeyGuard resolves the environment from the Bearer key
- [ ] Server keys can read full rules; client keys can only evaluate
- [ ] last_used_at is written at most once per minute per key, not on every request

### 204 · Update flag configuration per environment

*Story · Epic E2 · 3 pts · Priority High · Labels: backend, api*

> As a developer, I want to toggle a flag and edit its rules per environment so that I can roll out to staging before production.

PATCH /api/v1/flags/:flagId/environments/:envKey

**Acceptance criteria**

- [ ] Accepts enabled, rules, fallthrough and offVariation
- [ ] The body is validated with the same Zod schema the evaluator uses
- [ ] The client must send the current `version`; a stale version returns 409 Conflict
- [ ] version increments on every update, and the environment's ruleset_version is bumped in the same transaction
- [ ] e2e tests, including a concurrent-update conflict

### 205 · SDK rules endpoint with ETag

*Story · Epic E6 · 2 pts · Priority High · Labels: backend, sdk*

> As a server SDK, I want to download my environment's full ruleset cheaply so that polling doesn't waste bandwidth.

GET /sdk/v1/rules, authenticated with a server key.

**Acceptance criteria**

- [ ] Returns all non-archived flags and their config for the key's environment
- [ ] The ETag header is derived from environments.ruleset_version
- [ ] If-None-Match with a matching ETag returns 304 and an empty body
- [ ] The response shape is a Zod schema in @flagpole/shared
- [ ] e2e test: 200 → 304 → change a flag → 200 with the new ETag

### 206 · Node.js server SDK (polling + local evaluation)

*Story · Epic E6 · 5 pts · Priority High · Labels: sdk*

> As a backend developer, I want an SDK that evaluates flags locally so that flag checks add no network latency to my requests.

packages/sdk-node, built on the shared evaluator.

**Acceptance criteria**

- [ ] `const client = await Flagpole.init({ sdkKey, baseUrl })`
- [ ] Typed getters getBoolean / getString / getNumber / getJson(flagKey, context, defaultValue)
- [ ] Polls every 30s by default, using ETag
- [ ] Getters never throw: on error they return the default and log once
- [ ] After the first load it keeps working with the last-known ruleset if the API is down
- [ ] close() stops polling
- [ ] Unit tests with mocked fetch
- [ ] Builds to ESM + CJS with type declarations

### 207 · Dashboard: login and flag overview

*Story · Epic E5 · 3 pts · Priority High · Labels: frontend*

> As a dashboard user, I want to log in and see my projects and flags with their status per environment so that I know what is live where.

First real Next.js 16 work: App Router, Server Components, shadcn/ui.

**Acceptance criteria**

- [ ] Routes: /login, /projects, /projects/[projectId]/flags
- [ ] Uses the API session cookie; the local cross-origin setup is documented
- [ ] The flag table shows key, name, type and an on/off indicator per environment
- [ ] Selected environment is kept in the URL (?env=production)
- [ ] Loading, empty and error states are handled
- [ ] A 401 response redirects to /login

## Backlog — next up (not yet scheduled)

**Total:** 29 points

| ID | Epic | Type | Summary | Pts |
|---|---|---|---|---|
| 301 | E5 | Story | Dashboard: create flag and toggle per environment | 3 |
| 302 | E5 | Story | Dashboard: targeting rules and rollout editor | 5 |
| 303 | E7 | Task | Deploy staging environment | 3 |
| 304 | E7 | Task | README with architecture diagram and demo GIF | 2 |
| 305 | E7 | Task | Example Express app using the SDK | 1 |
| 306 | E2 | Story | Audit log with before/after diff | 5 |
| 307 | E6 | Story | Real-time updates via Postgres LISTEN/NOTIFY and SSE | 5 |
| 308 | E6 | Story | React SDK with useFlag() hook | 5 |

### 301 · Dashboard: create flag and toggle per environment

*Story · Epic E5 · 3 pts · Priority Medium · Labels: frontend*

> As a dashboard user, I want to create flags and switch them on or off per environment from the UI so that I don't need to call the API by hand.

**Acceptance criteria**

- [ ] Create-flag form with type-aware variation inputs and validation from the shared Zod schemas
- [ ] Optimistic toggle that rolls back on error, with a 409 conflict handled gracefully
- [ ] Toast feedback on success and failure

### 302 · Dashboard: targeting rules and rollout editor

*Story · Epic E5 · 5 pts · Priority Medium · Labels: frontend*

> As a product owner, I want to edit targeting rules and percentage rollouts visually so that I can release safely without writing JSON.

**Acceptance criteria**

- [ ] Add, remove and reorder rules and clauses
- [ ] Rollout sliders whose total must equal 100%
- [ ] Preview panel: enter a sample context and see the evaluation result and reason (uses the shared evaluator in the browser)

### 303 · Deploy staging environment

*Task · Epic E7 · 3 pts · Priority Medium · Labels: infra, ci*

Dashboard on Vercel, API on a container host, managed Postgres.

**Acceptance criteria**

- [ ] Migrations run automatically on deploy
- [ ] Environment variables are documented
- [ ] Seeded demo account so recruiters can log in
- [ ] Live URLs added to the README

### 304 · README with architecture diagram and demo GIF

*Task · Epic E7 · 2 pts · Priority Medium · Labels: docs*

The README is the first thing reviewers see.

**Acceptance criteria**

- [ ] One-paragraph pitch, demo GIF and live link at the top
- [ ] Architecture diagram (Mermaid)
- [ ] Quickstart, ADR index and a Process section linking to docs/process and docs/sprints

### 305 · Example Express app using the SDK

*Task · Epic E7 · 1 pts · Priority Low · Labels: sdk, docs*

examples/express-demo shows a flag changing a response in real life.

**Acceptance criteria**

- [ ] Runs with one command against the local stack
- [ ] Linked from the README

### 306 · Audit log with before/after diff

*Story · Epic E2 · 5 pts · Priority Medium · Labels: backend*

> As a team lead, I want to see who changed which flag, when, and what changed so that I can trace incidents back to flag changes.

**Acceptance criteria**

- [ ] Every config change writes an audit entry in the same transaction
- [ ] API endpoint returns a paginated audit history per flag
- [ ] Dashboard shows a readable diff

### 307 · Real-time updates via Postgres LISTEN/NOTIFY and SSE

*Story · Epic E6 · 5 pts · Priority Medium · Labels: backend, sdk, adr*

> As a developer, I want flag changes to reach my servers within a second so that I can kill a broken feature instantly.

**Acceptance criteria**

- [ ] A config change triggers NOTIFY; every API instance LISTENs and pushes over Server-Sent Events
- [ ] The SDK uses SSE when available and falls back to polling
- [ ] ADR on SSE vs WebSockets vs polling (written by me)

### 308 · React SDK with useFlag() hook

*Story · Epic E6 · 5 pts · Priority Medium · Labels: sdk, frontend*

> As a frontend developer, I want a useFlag() hook so that my components re-render when a flag changes.

**Acceptance criteria**

- [ ] <FlagpoleProvider> plus a useFlag(key, default) hook
- [ ] Uses the client-key evaluate endpoint
- [ ] Works with Next.js App Router client components
- [ ] Tests with React Testing Library
