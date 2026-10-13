/** Reads DATABASE_URL, failing fast with a fix-it message instead of a cryptic connection error later. */
export function getDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const url = env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. For local development, copy apps/api/.env.example to apps/api/.env.',
    );
  }
  return url;
}
