import { describe, expect, test } from "bun:test";
import { createTestSets } from "./utils/createTestSets.ts";

describe("count", () => {
  const numbers = [1, 2, 3];
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
    expect(fromSingle.count().first() satisfies number).toEqual(numbers[0]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.count().first() satisfies Promise<number>),
    ).toBe(numbers.length);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.count().first() satisfies Promise<number>),
    ).toBe(numbers.length);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises.count().first()) satisfies number | Promise<number>,
    ).toBe(numbers.length);
  });

  test("from generator", async () => {
    expect(fromGenerator.count().first() satisfies number).toBe(numbers.length);
  });

  test("from array", () => {
    expect(fromArray.count().first() satisfies number).toBe(numbers.length);
  });

  test("from empty", () => {
    expect(fromEmpty.count().first() satisfies number).toBe(0);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.count().first() satisfies Promise<number>),
    ).toBe(0);
  });
});
