# Flagpole

A self-hostable feature flag and remote-config platform: a NestJS API, a Next.js admin dashboard, and TypeScript SDKs that evaluate flags locally inside your app.

> 🚧 Work in progress — Sprint 1 (foundation and core engine).

## Development commands

Requires Node.js 24 and pnpm 12. Run these from the repository root.

| Command                             | What it does                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm install`                      | Install every workspace package                                                                |
| `pnpm dev`                          | Run the API on http://localhost:3001 and the dashboard on http://localhost:3000, in watch mode |
| `pnpm build`                        | Build every package (cached by Turborepo)                                                      |
| `pnpm typecheck`                    | Type-check every package                                                                       |
| `pnpm lint`                         | Lint every package                                                                             |
| `pnpm test`                         | Run every package's tests                                                                      |
| `pnpm format` / `pnpm format:check` | Format with Prettier, or only check formatting                                                 |

To run a script in one package, use `--filter`, e.g. `pnpm --filter @flagpole/api test`.

Once `pnpm dev` is running, `GET http://localhost:3001/api/v1/health` returns `{ "status": "ok" }`.

## Documentation

- [Product backlog](docs/backlog/BACKLOG.md)
- [Working agreement](docs/process/WORKING_AGREEMENT.md)
- [Sprints](docs/sprints/)
- [Architecture Decision Records](docs/adr/)
