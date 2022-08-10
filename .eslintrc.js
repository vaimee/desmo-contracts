module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "standard",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules"] },
    ],
    "node/no-extraneous-import": [
      "error",
      {
        // @iexec/poco is a dependency of @iexec/doracle;
        // we allow it to be imported from the tests to
        // mock iexec proxy
        allowModules: ["@iexec/poco"],
      },
    ],
  },
};
