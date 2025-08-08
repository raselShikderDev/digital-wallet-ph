import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint'; 

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended, 

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', 
      },
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-console":"warn"
    },
  },
];

// digital-waalleet

// https://digital-wallet-sable.vercel.app/api/v1/user/register

https://digital-waalleet.vercel.app/api/v1/wallet/user-send-money
wallet/user-send-money