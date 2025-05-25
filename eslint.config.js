import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslintConfigPrettier,
  reactHooks.configs["recommended-latest"],
  reactCompiler.configs.recommended,
  js.configs.recommended,
  reactRefresh.configs.vite,
  tseslint.configs.recommended,
  {
    ignores: ["dist"],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-compiler/react-compiler": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
