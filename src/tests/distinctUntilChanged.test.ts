import { describe, test, expect } from "bun:test";
import yielded from "../";
import { createTestSets } from "./utils/createTestSets";

describe("distinctUntilChanged", () => {
  test("empty ", () => {
    expect(yielded([]).distinctUntilChanged().collect()).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      yielded([1, 2, 3])
        .distinctUntilChanged((a, b) => a === b)
        .collect(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("similar consecutive values", () => {
    expect(
      yielded([1, 1, 2, 3, 3, 4]).distinctUntilChanged().collect(),
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

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .distinctUntilChanged(fullTwosPredicate)
        .collect() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 1]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .distinctUntilChanged(fullTwosPredicate)
        .collect() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 1]);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises
        .resolve()
        .distinctUntilChanged(fullTwosPredicate)
        .collect()) satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from generator", async () => {
    expect(
      fromGenerator
        .distinctUntilChanged(fullTwosPredicate)
        .collect() satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from array", () => {
    expect(
      fromArray
        .distinctUntilChanged(fullTwosPredicate)
        .collect() satisfies number[],
    ).toStrictEqual([1, 2, 1]);
  });

  test("from empty", () => {
    expect(
      fromEmpty
        .distinctUntilChanged(fullTwosPredicate)
        .collect() satisfies number[],
    ).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .distinctUntilChanged(fullTwosPredicate)
        .collect() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
