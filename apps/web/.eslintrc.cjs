module.exports = {
  extends: ["@merch-portal/eslint-config/react"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "react/no-unknown-property": ["error", { ignore: ["args", "attach", "position", "rotation", "intensity", "castShadow", "receiveShadow", "metalness", "roughness", "emissive", "emissiveIntensity", "transparent", "side", "vertexColors", "sizeAttenuation", "blending", "object", "shadow-mapSize-width", "shadow-mapSize-height"] }],
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "no-useless-escape": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^(onDrag|onDragStart|onDragEnd|onAnimation)" }],
  },
};
