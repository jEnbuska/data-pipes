import { describe, test, expect } from "vitest";
import yielded from "../src/index.ts";

describe("some", () => {
  test("has some", () => {
    expect(yielded([false, true, false]).some(Boolean).resolve()).toBe(true);
  });

  test("has none", () => {
    expect(yielded([false, false, false]).some(Boolean).resolve()).toBe(false);
  });

  test("has every", () => {
    expect(yielded([true, true, true]).some(Boolean).resolve()).toBe(true);
  });
});
