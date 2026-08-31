import { defineConfig } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    // Architecture boundary: platform core must stay reusable — it may never
    // depend on a business module. See docs/ARCHITECTURE.md §2.
    files: ['src/modules/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/modules/rentals/**', '@/modules/rentals', '@/modules/rentals/**'],
              message: 'Platform core must not import from business modules (docs/ARCHITECTURE.md §2).',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '.next/',
      '.netlify/',
      'Desings/',
      'src/payload-types.ts',
      'src/payload-generated-schema.ts',
    ],
  },
])

export default eslintConfig
