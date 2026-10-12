// @ts-check
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

// Base config for every package. Packages that need extra rules (e.g. apps/web with
// eslint-config-next) add a local eslint.config.mjs that spreads this one.
export default defineConfig(
  globalIgnores(['**/dist/', '**/.next/', '**/coverage/', '**/.turbo/']),
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // CLAUDE.md: non-null assertions need a comment, so they need an explicit eslint-disable.
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
