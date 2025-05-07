import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import securityPlugin from "eslint-plugin-security";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
const configs = [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
    { ignores: ["eslint.config.mjs"] },
    {
        plugins: {
            import: importPlugin,
            prettier: prettierPlugin,
            security: securityPlugin,
            "simple-import-sort": simpleImportSort,
        },
    },
    {
        rules: {
            "no-console": "warn",
            "no-unused-vars": "error",
            "no-undef": "error",

            "no-unused-expressions": "error",
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-empty-function": [
                "warn",
                { allow: ["methods", "getters", "constructors"] },
            ],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    // airbnbBase,
    prettierConfig,
];

export default configs;
