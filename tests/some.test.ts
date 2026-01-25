import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";

describe("some", () => {
  test("has some", () => {
    expect(yielded([false, true, false]).some(Boolean).toArray()).toBe(true);
  });

  test("has none", () => {
    expect(yielded([false, false, false]).some(Boolean).toArray()).toBe(false);
  });

  test("has every", () => {
    expect(yielded([true, true, true]).some(Boolean).toArray()).toBe(true);
  });
});
