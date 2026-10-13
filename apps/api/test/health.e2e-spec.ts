import type { Server } from 'node:http';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';
import { PG_POOL } from '../src/database/database.module.js';

// Stands in for pg.Pool so these tests run without a database. The real connection is checked
// manually against Docker Compose (and by integration tests once CI has a Postgres service).
function createFakePool() {
  return { query: vi.fn(), end: vi.fn().mockResolvedValue(undefined) };
}

async function createApp(
  pool: ReturnType<typeof createFakePool>,
): Promise<INestApplication<Server>> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PG_POOL)
    .useValue(pool)
    .compile();
  // Express adapter: getHttpServer() returns a Node http.Server, which supertest accepts.
  const app = moduleRef.createNestApplication<INestApplication<Server>>({ logger: false });
  configureApp(app);
  await app.init();
  return app;
}

describe('health endpoints', () => {
  const pool = createFakePool();
  let app: INestApplication<Server>;

  beforeAll(async () => {
    app = await createApp(pool);
  });

  beforeEach(() => {
    pool.query.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns 200 without touching the database', async () => {
    await request(app.getHttpServer()).get('/api/v1/health').expect(200).expect({ status: 'ok' });

    expect(pool.query).not.toHaveBeenCalled();
  });

  it('GET /api/v1/health/ready returns 200 when the database answers', async () => {
    pool.query.mockResolvedValue({ rows: [{ '?column?': 1 }] });

    await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200)
      .expect({ status: 'ok', database: 'up' });
    expect(pool.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('GET /api/v1/health/ready returns 503 when the database is unreachable', async () => {
    pool.query.mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5433'));

    await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(503)
      .expect({ status: 'error', database: 'down' });
  });
});

describe('shutdown', () => {
  it('closes the database pool when the app closes', async () => {
    const pool = createFakePool();
    const app = await createApp(pool);

    await app.close();

    expect(pool.end).toHaveBeenCalledOnce();
  });
});
