# Flagpole

A self-hostable feature flag and remote-config platform: a NestJS API, a Next.js admin dashboard, and TypeScript SDKs that evaluate flags locally inside your app.

> 🚧 Work in progress — Sprint 1 (foundation and core engine).

## Run locally

Requires Node.js 24, pnpm 12 and Docker Desktop (running). Run everything from the repository root.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create the API's local environment file from the example:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   In PowerShell:

   ```powershell
   Copy-Item apps/api/.env.example apps/api/.env
   ```

3. Start PostgreSQL and wait until it is healthy:

   ```bash
   docker compose up -d --wait
   ```

4. Start the API and the dashboard:

   ```bash
   pnpm dev
   ```

5. Check that everything is connected:
   - http://localhost:3001/api/v1/health/ready returns `{ "status": "ok", "database": "up" }` (or `503` with `"database": "down"` if PostgreSQL is not reachable).
   - http://localhost:3001/api/v1/health only checks that the API process is running.
   - The dashboard is at http://localhost:3000.

### Database port

The PostgreSQL container listens on host port **5433**, not the default 5432, so it can run next to a local PostgreSQL install. It only accepts connections from this machine (`127.0.0.1`).

To use a different port, copy the root `.env.example` to `.env` and set `POSTGRES_HOST_PORT`, then change the port in `DATABASE_URL` in `apps/api/.env` to match.

### Stopping the database

- `docker compose stop` stops the container. `docker compose up -d --wait` starts it again.
- `docker compose down` removes the container. The data stays in the `flagpole_postgres-data` volume.

> [!WARNING]
> `docker compose down -v` also deletes the `flagpole_postgres-data` volume, and with it **all data in the local database**. Use it only when you want to start from an empty database.

## Development commands

Run these from the repository root.

| Command                             | What it does                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm install`                      | Install every workspace package                                                                |
| `pnpm dev`                          | Run the API on http://localhost:3001 and the dashboard on http://localhost:3000, in watch mode |
| `pnpm build`                        | Build every package (cached by Turborepo)                                                      |
| `pnpm typecheck`                    | Type-check every package                                                                       |
| `pnpm lint`                         | Lint every package                                                                             |
| `pnpm test`                         | Run every package's tests                                                                      |
| `pnpm format` / `pnpm format:check` | Format with Prettier, or only check formatting                                                 |
| `docker compose up -d --wait`       | Start PostgreSQL and wait until it is healthy                                                  |
| `docker compose down`               | Stop and remove the PostgreSQL container (keeps the data volume)                               |

To run a script in one package, use `--filter`, e.g. `pnpm --filter @flagpole/api test`.

## Documentation

- [Product backlog](docs/backlog/BACKLOG.md)
- [Working agreement](docs/process/WORKING_AGREEMENT.md)
- [Sprints](docs/sprints/)
- [Architecture Decision Records](docs/adr/)
