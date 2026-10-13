import type { INestApplication } from '@nestjs/common';
import { ADMIN_API_PREFIX } from '@flagpole/shared';

/** App-wide setup shared by main.ts and the e2e tests, so tests exercise the real configuration. */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix(ADMIN_API_PREFIX);
}
