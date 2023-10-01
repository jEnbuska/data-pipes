import { describe, test, expect } from "bun:test";
import { chainable, find } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("find", () => {
  test("find first", () => {
    expect(
      chainable(1, 2, 3)
        .find((it) => it === 1)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("find second", () => {
    expect(
      chainable(1, 2, 3)
        .find((it) => it === 2)
        .toArray(),
    ).toStrictEqual([2]);
  });

  test("find last", () => {
    expect(
      chainable(1, 2, 3)
        .find((it) => it === 3)
        .toArray(),
    ).toStrictEqual([3]);
  });

  test("find none", () => {
    expect(
      chainable(1, 2, 3)
        .find((it) => it === 4)
        .toArray(),
    ).toStrictEqual([]);
  });

  test("pipe - find", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        find((n) => n > 2),
      ).toArray(),
    ).toStrictEqual([3]);
  });
});
