import { describe, test, expect } from "bun:test";
import { pipe } from "./pipe.ts";
import {
  map,
  filter,
  distinctBy,
  flatMap,
  sort,
  chain,
  reduce,
  forEach,
  takeWhile,
} from "../";

describe("pipe", () => {
  test("map single", () => {
    const result = pipe(
      1,
      map((n) => n + 1),
      map((n) => n * 2),
    ).first();
    expect(result).toBe(4);
    pipe(
      1,
      map((n) => n + 1),
      map((n) => n * 2),
    ).consume();
  });

  test("from generator", () => {
    const result = pipe(
      function* () {
        yield 1;
        yield 2;
        yield 3;
      },
      map((n) => n + 1),
    ).toArray();
    expect(result).toStrictEqual([2, 3, 4]);
  });

  test("Mixed", () => {
    const result = pipe(
      [1, 2, 3, 4, 5],
      map((n) => ({ n })),
      filter((next) => next.n > 2),
      distinctBy((next) => next.n % 2),
      map((next) => [next]),
      flatMap((next) => next.map(({ n }) => n)),
      sort((a, z) => z - a),
    ).toArray();
    expect(result).toStrictEqual([4, 3]);
  });

  test("Pipe as source", () => {
    const iterated: number[] = [];
    pipe(
      pipe(
        [1, 2, 3, 4, 5],
        forEach((n) => iterated.push(n)),
      ),
      takeWhile((n) => n < 3),
    ).consume();
    expect(iterated).toStrictEqual([1, 2, 3]);
  });

  test("Chainable as source", () => {
    const max = pipe(
      chain([1, 2, 3]).map((n) => n * 2),
      reduce((max, next) => (max < next ? next : max), 0),
    ).toArray();
    expect(max).toStrictEqual([6]);
  });
});
