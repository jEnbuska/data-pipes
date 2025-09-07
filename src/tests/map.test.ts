import { describe, test, expect } from "bun:test";
import { chain, map } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";

describe("map", () => {
  test("chainable", () => {
    expect(
      chain([1, 2])
        .map((n) => n * 2)
        .toArray(),
    ).toStrictEqual([2, 4]);
  });

  test("async chainable", async () => {
    expect(
      (await chain(async function* () {
        yield 1;
        yield 2;
      })
        .map((n) => n * 2)
        .toArray()) satisfies number[],
    ).toStrictEqual([2, 4]);
  });

  test("chainable resolve", async () => {
    expect(
      (await chain([Promise.resolve(1), Promise.resolve(2)])
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
