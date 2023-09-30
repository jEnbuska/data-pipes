import { describe, test, expect } from "bun:test";
import { map, filter, distinctBy, unflat, flatMap, sort } from "./index.ts";
import { pipe } from "./pipe.ts";

describe("pipe", () => {
  test("map single", () => {
    const result = pipe(
      1,
      map((n) => n + 1),
      map((n) => n * 2),
    ).toSingle();
    expect(result).toBe(4);
  });

  test("Symbol.iterator", () => {
    const result = [
      ...pipe(
        1,
        map((n) => n + 1),
        map((n) => n * 2),
      ),
    ];
    expect(result).toStrictEqual([4]);
  });

  test("Symbol.iterator", () => {
    const result = [
      ...pipe(
        1,
        map((n) => n + 1),
        map((n) => n * 2),
      ),
    ];
    expect(result).toStrictEqual([4]);
  });

  test("Mixed", () => {
    const result = pipe(
      [1, 2, 3, 4, 5],
      map((n) => ({ n })),
      filter((next) => next.n > 2),
      distinctBy((next) => next.n % 2),
      unflat(),
      flatMap((next) => next.map(({ n }) => n)),
      sort((a, z) => z - a),
    ).toArray();
    expect(result).toStrictEqual([4, 3]);
  });
});
