import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    slowTestThreshold: 10_000,
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"], // your test files
  },
  resolve: {
    // This helps Vitest understand TS aliases / extensions
    extensions: [".ts"],
  },
});
