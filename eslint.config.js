const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier/flat');
const globals = require('globals');

module.exports = [
  ...(Array.isArray(expoConfig) ? expoConfig : [expoConfig]),
  eslintConfigPrettier,
  {
    ignores: ['dist/**', '.expo/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: ['jest.setup.js'],
    languageOptions: { globals: globals.jest },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'import/first': 'off',
      'import/no-duplicates': 'off',
    },
  },
];
