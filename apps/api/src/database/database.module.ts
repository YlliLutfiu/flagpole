import { Inject, Logger, Module, type OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';

import { getDatabaseUrl } from './database-url.js';

/** Injection token for the shared pg connection pool. */
export const PG_POOL = Symbol('PG_POOL');

const CONNECTION_TIMEOUT_MS = 2_000;

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: (): Pool => {
        const pool = new Pool({
          connectionString: getDatabaseUrl(),
          connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
        });
        // An idle client whose connection drops (e.g. the database restarts) emits 'error' on the pool.
        // Without a listener, Node treats it as an unhandled error and crashes the process.
        const logger = new Logger('Database');
        pool.on('error', (error) => {
          logger.error(`Idle PostgreSQL client error: ${error.message}`);
        });
        return pool;
      },
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
