import { describe, test, expect } from "bun:test";
import yielded from "../";

describe("some", () => {
  test("has some", () => {
    expect(yielded([false, true, false]).some(Boolean).collect()).toBe(true);
  });

  test("has none", () => {
    expect(yielded([false, false, false]).some(Boolean).collect()).toBe(false);
  });

  test("has every", () => {
    expect(yielded([true, true, true]).some(Boolean).collect()).toBe(true);
  });
});
