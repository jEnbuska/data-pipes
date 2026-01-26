import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("some", () => {
  test("has some", () => {
    expect(
      Yielded.from([false, true, false]).some(Boolean) satisfies boolean,
    ).toBe(true);
  });

  test("has none", () => {
    expect(
      Yielded.from([false, false, false]).some(Boolean) satisfies boolean,
    ).toBe(false);
  });

  test("has every", () => {
    expect(
      Yielded.from([true, true, true]).some(Boolean) satisfies boolean,
    ).toBe(true);
  });
});
