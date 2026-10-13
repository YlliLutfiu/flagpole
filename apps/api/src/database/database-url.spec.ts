import { describe, expect, it } from 'vitest';

import { getDatabaseUrl } from './database-url.js';

describe('getDatabaseUrl', () => {
  it('returns DATABASE_URL when it is set', () => {
    const url = 'postgres://user:pass@127.0.0.1:5433/db';

    expect(getDatabaseUrl({ DATABASE_URL: url })).toBe(url);
  });

  it('throws a message pointing at .env.example when it is missing', () => {
    expect(() => getDatabaseUrl({})).toThrow(/DATABASE_URL is not set.*\.env\.example/);
  });

  it('treats an empty value as missing', () => {
    expect(() => getDatabaseUrl({ DATABASE_URL: '' })).toThrow(/DATABASE_URL is not set/);
  });
});
