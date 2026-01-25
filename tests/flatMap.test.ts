import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("flatMap", () => {
  test("flatten non array", () => {
    expect(
      Yielded.from([1, 2, 3])
        .flatMap((it) => it)
        .toArray() satisfies number[],
    ).toStrictEqual([1, 2, 3]);
  });

  const numbers = [[[1, 2]], [], [3, [4, 5]]] satisfies Array<
    number | Array<number | number[]>
  >;
  const expected = [[1, 2], 3, [4, 5]] satisfies Array<number | number[]>;
  const {
    fromResolvedPromises,
    fromSingle,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(numbers);
  test("from single", () => {
    expect(
      fromSingle.flatMap((next) => next).toArray() satisfies Array<
        number | number[]
      >,
    ).toEqual(expected[0]);
  });

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises
        .flatMap((next) => next)
        .toArray() satisfies Promise<Array<number | number[]>>),
    ).toStrictEqual(expected);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .flatMap((next) => next)
        .toArray() satisfies Promise<Array<number | number[]>>),
    ).toStrictEqual(expected);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises
        .awaited()
        .flatMap((next) => next)
        .toArray()) satisfies Array<number | number[]>,
    ).toStrictEqual(expected);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.flatMap((next) => next).toArray() satisfies Array<
        number | number[]
      >,
    ).toStrictEqual(expected);
  });

  test("from array", () => {
    expect(
      fromArray.flatMap((next) => next).toArray() satisfies Array<
        number | number[]
      >,
    ).toStrictEqual(expected);
  });

  test("from empty", () => {
    expect(
      fromEmpty.flatMap((next) => next).toArray() satisfies Array<
        number | number[]
      >,
    ).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.flatMap((next) => next).toArray() satisfies Promise<
        Array<number | number[]>
      >),
    ).toStrictEqual([]);
  });
});
