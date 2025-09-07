import { describe, test, expect } from "bun:test";
import { chain, distinctUntilChanged } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("distinctUntilChanged", () => {
  test("empty ", () => {
    expect(chain([]).distinctUntilChanged().toArray()).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      chain([1, 2, 3])
        .distinctUntilChanged((a, b) => a === b)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("similar consecutive values", () => {
    expect(
      chain([1, 1, 2, 3, 3, 4]).distinctUntilChanged().toArray(),
    ).toStrictEqual([1, 2, 3, 4]);
  });

  test("pipe - distinctUntilChanged using modulo 3", () => {
    expect(
      pipe(
        [1, 2, 5, 8, 3],
        distinctUntilChanged((a, b) => a % 3 === b % 3),
      ).toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  const fullTwosPredicate = (previous: number, current: number) =>
    Math.floor(previous / 2) === Math.floor(current / 2);
  const numbers = [1, 2, 3, 3, 2, 1];
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
      fromSingle
        .distinctUntilChanged(fullTwosPredicate)
        .toArray() satisfies number[],
    ).toEqual([1]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .distinctUntilChanged(fullTwosPredicate)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 1]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .distinctUntilChanged(fullTwosPredicate)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 1]);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises
        .resolve()
        .distinctUntilChanged(fullTwosPredicate)
        .toArray()) satisfies number[] | Promise<number[]>,
    ).toStrictEqual([1, 2, 1]);
  });

  test("from generator", async () => {
    expect(
      fromGenerator
        .distinctUntilChanged(fullTwosPredicate)
        .toArray() satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from array", () => {
    expect(
      fromArray
        .distinctUntilChanged(fullTwosPredicate)
        .toArray() satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from empty", () => {
    expect(
      fromEmpty
        .distinctUntilChanged(fullTwosPredicate)
        .toArray() satisfies number[],
    ).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .distinctUntilChanged(fullTwosPredicate)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
