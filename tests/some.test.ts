import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("some", () => {
  test("has some", () => {
    expect(Yielded.from([false, true, false]).some(Boolean)).toBe(true);
  });

  test("has none", () => {
    expect(Yielded.from([false, false, false]).some(Boolean)).toBe(false);
  });

  test("has every", () => {
    expect(Yielded.from([true, true, true]).some(Boolean)).toBe(true);
  });
});
