import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

// Tests against a real PostgreSQL: `docker compose up -d --wait` locally, a service container in CI.
// DATABASE_URL already set in the environment (CI) wins; otherwise it comes from apps/api/.env.
export default defineConfig(({ mode }) => ({
  test: {
    include: ['test/**/*.int-spec.ts'],
    env: loadEnv(mode, process.cwd(), ''),
  },
}));
