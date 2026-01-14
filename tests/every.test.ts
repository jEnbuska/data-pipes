import { describe, test, expect } from "vitest";
import yielded from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("every", () => {
  test("has every", () => {
    expect(yielded([true, true, true]).every(Boolean).resolve()).toBe(true);
  });
  test("has none", () => {
    expect(yielded([false, false, false]).every(Boolean).resolve()).toBe(false);
  });

  test("has some", () => {
    expect(yielded([false, false, false]).every(Boolean).resolve()).toBe(false);
  });

  const numbers = [1, 2, 3, 4];
  const {
    fromResolvedPromises,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(numbers);
  function isGreaterThenZero(value: number) {
    return value > 0;
  }

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises
        .every(isGreaterThenZero)
        .resolve() satisfies Promise<boolean>),
    ).toStrictEqual(true);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .every(isGreaterThenZero)
        .resolve() satisfies Promise<boolean>),
    ).toStrictEqual(true);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises
        .toAwaited()
        .every(isGreaterThenZero)
        .resolve()) satisfies boolean,
    ).toStrictEqual(true);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.every(isGreaterThenZero).resolve() satisfies boolean,
    ).toStrictEqual(true);
  });

  test("from array", () => {
    expect(
      fromArray.every(isGreaterThenZero).resolve() satisfies boolean,
    ).toStrictEqual(true);
  });

  function isGreaterThan100(value: number) {
    return value > 100;
  }
  test("from empty", () => {
    expect(
      fromEmpty.every(isGreaterThan100).resolve() satisfies boolean | void,
    ).toStrictEqual(true);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.every(isGreaterThan100).resolve() satisfies Promise<
        boolean | void
      >),
    ).toStrictEqual(true);
  });
});
