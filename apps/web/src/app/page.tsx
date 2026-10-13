import { ADMIN_API_PREFIX } from '@flagpole/shared';

export default function HomePage() {
  return (
    <main>
      <h1>Flagpole</h1>
      <p>
        Admin API prefix: <code>{ADMIN_API_PREFIX}</code>
      </p>
    </main>
  );
}
