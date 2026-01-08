import { describe, test, expect } from "bun:test";
import { streamless } from "../";
import { createTestSets } from "./utils/createTestSets.ts";

describe("distinctUntilChanged", () => {
  test("empty ", () => {
    expect(streamless([]).distinctUntilChanged().toArray()).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      streamless([1, 2, 3])
        .distinctUntilChanged((a, b) => a === b)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("similar consecutive values", () => {
    expect(
      streamless([1, 1, 2, 3, 3, 4]).distinctUntilChanged().toArray(),
    ).toStrictEqual([1, 2, 3, 4]);
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
      (await fromPromises
        .resolve()
        .distinctUntilChanged(fullTwosPredicate)
        .toArray()) satisfies number[],
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
