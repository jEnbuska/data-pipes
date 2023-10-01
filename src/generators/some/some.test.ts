import { describe, test, expect } from "bun:test";
import { chainable, some } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("some", () => {
  test("has some", () => {
    expect(chainable(false, true, false).some(Boolean).first()).toBe(true);
  });

  test("has none", () => {
    expect(chainable(false, false, false).some(Boolean).first()).toBe(false);
  });

  test("has every", () => {
    expect(chainable(true, true, true).some(Boolean).first()).toBe(true);
  });

  test("pipe - some", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        some((n) => n > 2),
      ).first(),
    ).toBe(true);
  });
});
