import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Store tests are pure logic — no DOM needed.
    environment: "node",
  },
  resolve: {
    alias: {
      // Match the @/ alias from tsconfig so imports resolve in tests.
      "@": path.resolve(__dirname, "./"),
    },
  },
});
