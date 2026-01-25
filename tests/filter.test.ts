import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("filter", () => {
  test("chainable", () => {
    expect(
      Yielded.from([1, 2, 3, 4])
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
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(numbers);

  test("from resolved promises", async () => {
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
        .awaited()
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
