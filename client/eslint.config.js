import js from "@eslint/js";
import globals, { browser, es2020, jest } from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    env: {
      browser: true,
      es2020: true,
      jest: true,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      "prettier/prettier": "warn",
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off",

      eqeqeq: "warn",
      "no-unused-vars": ["warn"],
      // "no-console": "warn",
      semi: ["error", "always"],
      // indent: ["error", 2],
      "no-undef": "error",
      "no-empty": "warn",
      "prefer-const": "warn",
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-duplicate-imports": "error",
      // "max-len": ["error", { code: 80 }],
      "consistent-return": "warn",
    },
  },
];
