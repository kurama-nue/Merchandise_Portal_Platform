module.exports = {
  extends: ["@merch-portal/eslint-config"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["**/*.test.ts", "**/__tests__/**"],
  rules: {
    "@typescript-eslint/no-namespace": "warn",
  },
};
