import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';

import { HealthService } from './health.service.js';

export interface HealthResponse {
  status: 'ok';
}

export interface ReadinessResponse {
  status: 'ok' | 'error';
  database: 'up' | 'down';
}

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /** Liveness: the process is running. Deliberately independent of the database. */
  @Get()
  check(): HealthResponse {
    return { status: 'ok' };
  }

  /** Readiness: the API can serve requests, which needs the database. Returns 503 when it is down. */
  @Get('ready')
  async ready(): Promise<ReadinessResponse> {
    if (!(await this.healthService.isDatabaseUp())) {
      const body: ReadinessResponse = { status: 'error', database: 'down' };
      throw new ServiceUnavailableException(body);
    }
    return { status: 'ok', database: 'up' };
  }
}
