import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    ignores: ['**/node_modules/*', '**/out/*', '**/.next/*'],
  },
  ...compat.extends(
    'next/core-web-vitals',
    // 'next/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),
  {
    plugins: {
      react,
      'simple-import-sort': simpleImportSort,
      prettier,
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      prettier: {
        usePrettierrc: true,
      },
    },

    rules: {
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_+$',
          argsIgnorePattern: '^_+$',
        },
      ],

      'react/jsx-no-useless-fragment': 'warn',
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      'react/display-name': 'off',

      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
          allow: ['shadcnUi/**'],
        },
      ],

      'simple-import-sort/exports': 'warn',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^node:'],
            ['^react', '^react-dom', '^react/(.*)$'],
            ['^next', '^next/(.*)$'],
            ['^@?\\w'],
            [
              '^@/hooks/(.*)$',
              '^@/providers/(.*)$',
              '^@/redux/(.*)$',
              '^@/lib/(.*)$',
              '^@/services/(.*)$',
            ],
            [
              '^@/constants/(.*)$',
              '^@/schemas/(.*)$',
              '^@/types/(.*)$',
              '^@?\\w.*\\b(type)$',
            ],
            ['^@/components/(.*)$'],
            ['^@/(.*)$'],
            ['^\\.'],
            [
              '^.+\\.(css|scss|sass)$',
              '^.+\\.(svg|jpg|jpeg|png|gif|ico|woff|woff2|ttf|eot)$',
            ],
          ],
        },
      ],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
      ],
    },
  },
];
