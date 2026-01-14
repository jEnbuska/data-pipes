import { describe, test, expect } from "vitest";
import yielded from "../index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("distinctUntilChanged", () => {
  test("empty ", () => {
    expect(yielded([]).distinctUntilChanged().resolve()).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      yielded([1, 2, 3])
        .distinctUntilChanged((a, b) => a === b)
        .resolve(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("similar consecutive values", () => {
    expect(
      yielded([1, 1, 2, 3, 3, 4]).distinctUntilChanged().resolve(),
    ).toStrictEqual([1, 2, 3, 4]);
  });

  const fullTwosPredicate = (previous: number, current: number) =>
    Math.floor(previous / 2) === Math.floor(current / 2);
  const numbers = [1, 2, 3, 3, 2, 1];
  const {
    fromResolvedPromises,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(numbers);

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises
        .distinctUntilChanged(fullTwosPredicate)
        .resolve() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 1]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .distinctUntilChanged(fullTwosPredicate)
        .resolve() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 1]);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises
        .toAwaited()
        .distinctUntilChanged(fullTwosPredicate)
        .resolve()) satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from generator", async () => {
    expect(
      fromGenerator
        .distinctUntilChanged(fullTwosPredicate)
        .resolve() satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from array", () => {
    expect(
      fromArray
        .distinctUntilChanged(fullTwosPredicate)
        .resolve() satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from empty", () => {
    expect(
      fromEmpty
        .distinctUntilChanged(fullTwosPredicate)
        .resolve() satisfies number[],
    ).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .distinctUntilChanged(fullTwosPredicate)
        .resolve() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
