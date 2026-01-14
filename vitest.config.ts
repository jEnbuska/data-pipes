import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"], // your test files
  },
  resolve: {
    // This helps Vitest understand TS aliases / extensions
    extensions: [".ts"],
  },
});
