import { describe, test, expect } from "bun:test";
import { createTestSets } from "./utils/createTestSets";
import streamless from "../";

describe("filter", () => {
  test("chainable", () => {
    expect(
      streamless([1, 2, 3, 4])
        .filter((n) => n % 2)
        .toArray(),
    ).toStrictEqual([1, 3]);
  });

  const numbers = [1, 2, 3];
  function module2(value: number) {
    return value % 2;
  }
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
    expect(fromSingle.filter(module2).toArray() satisfies number[]).toEqual([
      numbers[0],
    ]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.filter(module2).toArray() satisfies Promise<
        number[]
      >),
    ).toStrictEqual([1, 3]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.filter(module2).toArray() satisfies Promise<
        number[]
      >),
    ).toStrictEqual([1, 3]);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises
        .resolve()
        .filter(module2)
        .toArray()) satisfies number[],
    ).toStrictEqual([1, 3]);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.filter(module2).toArray() satisfies number[],
    ).toStrictEqual([1, 3]);
  });

  test("from array", () => {
    expect(
      fromArray.filter(module2).toArray() satisfies number[],
    ).toStrictEqual([1, 3]);
  });

  test("from empty", () => {
    expect(
      fromEmpty.filter(module2).toArray() satisfies number[],
    ).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.filter(module2).toArray() satisfies Promise<
        number[]
      >),
    ).toStrictEqual([]);
  });
});
