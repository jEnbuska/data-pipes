import { describe, test, expect } from "bun:test";
import { chainable, filter } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("filter", () => {
  test("chainable", () => {
    expect(
      chainable(1, 2, 3, 4)
        .filter((n) => n % 2)
        .toArray(),
    ).toStrictEqual([1, 3]);
  });

  test("pipe", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        filter((n) => n % 2),
      ).toArray(),
    ).toStrictEqual([1, 3]);
  });
});
