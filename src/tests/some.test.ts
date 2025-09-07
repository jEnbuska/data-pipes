import { describe, test, expect } from "bun:test";
import { chain, some } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";

describe("some", () => {
  test("has some", () => {
    expect(chain([false, true, false]).some(Boolean).first()).toBe(true);
  });

  test("has none", () => {
    expect(chain([false, false, false]).some(Boolean).first()).toBe(false);
  });

  test("has every", () => {
    expect(chain([true, true, true]).some(Boolean).first()).toBe(true);
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
