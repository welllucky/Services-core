const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const js = require("@eslint/js");

module.exports = {
  ...js.configs.recommended,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort", "import"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "plugin:security/recommended-legacy",
    "airbnb",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "error",
    "no-undef": "error",
    "no-empty-function": "warn",
    "no-unused-expressions": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  eslintPluginPrettierRecommended,
};
