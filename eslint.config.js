import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import preferArrow from "eslint-plugin-prefer-arrow";
import typescript from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "dist",
      ".husky/**",
      "src/types/database.ts",
      "src/components/ui/**",
      "src/hooks/use-*.ts",
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: typescript,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "18.3" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "prefer-arrow": preferArrow,
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      semi: ["error", "always"],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "prefer-arrow-callback": "error",
      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      "no-var": "error",
      "prefer-const": "error",
      "arrow-spacing": ["error", { before: true, after: true }],

      // Disable the original rule in favor of the TypeScript-specific one
      "no-unused-vars": "off",

      // Use TypeScript-specific rule with better type definition handling
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          // This helps with type definitions
          args: "all",
          varsIgnorePattern: "^React$",
          caughtErrors: "none",
        },
      ],

      "no-duplicate-imports": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "template-curly-spacing": ["error", "never"],
      "no-useless-rename": "error",
      "no-useless-constructor": "error",
      "no-const-assign": "error",
      "no-new-symbol": "error",
      "no-this-before-super": "error",
      "require-yield": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
