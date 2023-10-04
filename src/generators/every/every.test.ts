import { describe, test, expect } from "bun:test";
import { chainable, every } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("every", () => {
  test("has every", () => {
    expect(chainable([true, true, true]).every(Boolean).first()).toBe(true);
  });
  test("has none", () => {
    expect(chainable([false, false, false]).every(Boolean).first()).toBe(false);
  });

  test("has some", () => {
    expect(chainable([false, false, false]).every(Boolean).first()).toBe(false);
  });

  test("pipe - every", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        every((n) => n > 1),
      ).first(),
    ).toBe(false);
  });
});
