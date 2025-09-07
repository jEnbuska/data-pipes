import { describe, test, expect } from "bun:test";
import { chainable, map } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("map", () => {
  test("chainable", () => {
    expect(
      chainable([1, 2])
        .map((n) => n * 2)
        .toArray(),
    ).toStrictEqual([2, 4]);
  });

  test("async chainable", async () => {
    expect(
      (await chainable(async function* () {
        yield 1;
        yield 2;
      })
        .map((n) => n * 2)
        .toArray()) satisfies number[],
    ).toStrictEqual([2, 4]);
  });

  test("chainable resolve", async () => {
    expect(
      (await chainable([Promise.resolve(1), Promise.resolve(2)])
        .resolve()
        .map((n) => Promise.resolve((n satisfies number) * 2))
        .toArray()) satisfies number[],
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
