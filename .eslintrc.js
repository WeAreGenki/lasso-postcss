// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'es5',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    node: true,
    jest: true,
    'jest/globals': true
  },
  plugins: [
    'jest',
  ],
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
  ],
  rules: {
    'strict': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
    'object-curly-newline': ['error', { consistent: true }],
  }
};
