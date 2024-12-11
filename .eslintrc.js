const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const js = require("@eslint/js");

module.exports = {
  ...js.configs.recommended,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["plugin:@typescript-eslint/recommended"],
  root: true,
  env: {
    node: true,
    jest: true,
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
