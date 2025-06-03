import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Bring in next/core-web-vitals
  ...compat.extends("next/core-web-vitals"),

  // Add a matcher project files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
];
