import { describe, test, expect } from "bun:test";
import { chainable, map } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("map", () => {
  test("chainable", () => {
    expect(
      chainable(1, 2)
        .map((n) => n * 2)
        .toArray(),
    ).toStrictEqual([2, 4]);
  });

  test("pipe", () => {
    expect(
      pipe(
        [1, 2],
        map((n) => n * 2),
      ).toArray(),
    ).toStrictEqual([2, 4]);
  });
});
