const js = require("@eslint/js");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  prettierConfig, // Ensure ESLint doesn't conflict with Prettier
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          useTabs: false,
        },
      ],
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "err|next|error", // Ignore `err`, `next`, `error` in function parameters
          varsIgnorePattern: "err|next|error", // Ignore `err`, `next`, `error` in variable declarations
        },
      ],
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-console": "error",
      "no-undef": "off",
    },
    ignores: ["node_modules/", "dist/"],
  },
];
