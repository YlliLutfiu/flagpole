import { describe, expect, it } from 'vitest';

import { ADMIN_API_PREFIX } from './index.js';

describe('ADMIN_API_PREFIX', () => {
  it('is the versioned admin API path', () => {
    expect(ADMIN_API_PREFIX).toBe('/api/v1');
  });
});
