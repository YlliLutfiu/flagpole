// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

import baseConfig from '../../eslint.config.mjs';

// Root base config (TypeScript rules) plus Next.js rules: React, hooks, a11y and Core Web Vitals.
export default defineConfig(baseConfig, nextVitals, globalIgnores(['next-env.d.ts']));
