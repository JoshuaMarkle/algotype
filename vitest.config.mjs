import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    // Node by default; hook tests opt into jsdom with a file pragma
    environment: "node",
    include: ["src/**/*.test.{js,jsx}", "backend/**/*.test.js"],
  },
});
