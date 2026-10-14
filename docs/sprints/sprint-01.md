# Sprint 01 — Foundation and core engine

**Dates:** 2026-10-12 → 2026-10-18
**Sprint goal:** A flag can be created through the API and evaluated correctly by a fully tested engine.
**Planned capacity:** 20 points   **Previous velocity:** n/a (first sprint; this one calibrates)

## Committed issues

| Key | Type | Summary | Points | Status |
|---|---|---|---|---|
| FLAG-8 | Task | Set up pnpm + Turborepo monorepo | 2 | To Do |
| FLAG-9 | Task | Local PostgreSQL with Docker Compose | 1 | To Do |
| FLAG-10 | Task | CI pipeline with GitHub Actions | 2 | To Do |
| FLAG-11 | Task | Spike: choose an ORM (Drizzle vs Prisma) | 1 | To Do |
| FLAG-12 | Story | Database schema, migrations and seed data | 3 | To Do |
| FLAG-13 | Story | Projects & environments API | 3 | To Do |
| FLAG-14 | Story | Flags CRUD API | 3 | To Do |
| FLAG-15 | Story | Targeting rule evaluator (hand-written) | 5 | To Do |

## Daily log

One line per day: done / next / blockers.

- Mon — FLAG-8: workspace, Turbo and tooling config done; next: shared package, API, web. No blockers.
- Tue — FLAG-8 done: workspace, ESM API (NestJS 12), Next.js 16 app, ADR-001. FLAG-9 done: Postgres 18 via Compose (port 5433), pg pool, /health/ready with 503 on DB down. FLAG-10 done: GitHub Actions CI with Postgres service container, real-database integration test, SHA-pinned actions, main protected by ruleset; repo made public.
- Wed — Next: FLAG-11 ORM spike. No blockers.
- Thu —
- Fri —
- Sat —
- Sun —

## Sprint review

**Goal met?** Yes / Partially / No — <why>

**Shipped:**
-

**Demo:** <link to GIF / screenshot / video>

**Metrics:** committed <x> pts · completed <y> pts · carried over <z> pts

## Retrospective

**Keep** (what worked):
- Planning each story before writing code; it caught the NestJS 12 ESM-only change before it became a problem.
- Keeping pnpm's release-age check on instead of exempting new packages.

**Problem** (what slowed me down):
- Infra stories had hidden config work (FLAG-9 was closer to 2 points than 1).
- Environment issues outside the code: Docker Desktop not running, PAT missing the `workflow` scope, repo accidentally private.

**Try** (one concrete change for next sprint):
-

## Carry-over to next sprint
-
