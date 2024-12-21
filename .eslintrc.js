module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: '@typescript-eslint/parser', // Ensure TypeScript parser is used
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      // Add any custom rules here
    },
    overrides: [
      {
        files: ['*.ts'],
        parser: '@typescript-eslint/parser',
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
        ],
        rules: {
          // TypeScript-specific rules
        },
      },
    ],
    ignorePatterns: ['node_modules/', 'dist/', 'build/'], // Ensure src is not ignored
  };
  