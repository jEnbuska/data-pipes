import { describe, test, expect } from "bun:test";
import source from "../index.ts";

describe("some", () => {
  test("has some", () => {
    expect(source([false, true, false]).some(Boolean).first()).toBe(true);
  });

  test("has none", () => {
    expect(source([false, false, false]).some(Boolean).first()).toBe(false);
  });

  test("has every", () => {
    expect(source([true, true, true]).some(Boolean).first()).toBe(true);
  });
});
