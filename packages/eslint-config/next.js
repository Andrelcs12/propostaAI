import { baseConfig } from "./base.js";

export default [
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/no-misused-promises": "off"
    }
  }
];
