module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],
  extends: ['airbnb', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  env: {
    browser: true,
    node: true,
    jest: true
  },
  ignorePatterns: ['src/**/*.min.js'],
  rules: {
    'prettier/prettier': ['error'],
    indent: ['error', 2],
    'react-hooks/exhaustive-deps': 'warn',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'import/prefer-default-export': 1,
    'react/jsx-filename-extension': 0,
    'react/no-array-index-key': 0,
    // Prop types are not needed in typescript
    'react/no-unused-prop-types': 0,
    'react/prop-types': 0,
    'no-bitwise': 0,
    // Allow importing of dev dependencies in select directories
    // (such as storybook config and stories)
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['.storybook/**', 'src/**/*.stories.tsx', '**/**.test.tsx']
      }
    ],
    // The button-has-type won't allow us to dynamically assign type
    // So we'll just remove it
    'react/button-has-type': 0,
    'no-plusplus': 0,
    'operator-assignment': 0,
    // no-unused-vars and no-undef throw errors when using variables in ts interfaces
    // Here we turn it off, and use the ts variant
    'no-unused-vars': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],
    // Allow importing of typescript/javascript files without extensions
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never'
      }
    ]
  }
};
