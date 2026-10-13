import type { Server } from 'node:http';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Pool } from 'pg';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';
import { PG_POOL } from '../src/database/database.module.js';

// Uses the real pg pool. Run with `pnpm test:integration`; see vitest.integration.config.ts.
describe('GET /api/v1/health/ready against a real database', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication<INestApplication<Server>>();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    // app is unset if beforeAll failed (e.g. DATABASE_URL missing); don't hide that error.
    await app?.close();
  });

  // Nest's testing logger drops warnings, so a failing readiness check alone would only say "503".
  // Querying the pool directly surfaces the real cause (e.g. ECONNREFUSED) in the test output.
  it('can query the database through the app pool', async () => {
    const pool = app.get<Pool>(PG_POOL);

    await expect(pool.query('SELECT 1 AS ok')).resolves.toMatchObject({ rows: [{ ok: 1 }] });
  });

  it('reports the database as up', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200)
      .expect({ status: 'ok', database: 'up' });
  });
});
