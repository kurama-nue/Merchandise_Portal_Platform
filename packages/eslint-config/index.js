module.exports = {
  extends: ["eslint:recommended", "prettier", "turbo"],
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
      },
    },
  ],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};