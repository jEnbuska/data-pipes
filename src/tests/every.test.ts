import { describe, test, expect } from "bun:test";
import { chain, every } from "../index.ts";
import { pipe } from "../pipe.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("every", () => {
  test("has every", () => {
    expect(chain([true, true, true]).every(Boolean).first()).toBe(true);
  });
  test("has none", () => {
    expect(chain([false, false, false]).every(Boolean).first()).toBe(false);
  });

  test("has some", () => {
    expect(chain([false, false, false]).every(Boolean).first()).toBe(false);
  });

  test("pipe - every", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        every((n) => n > 1),
      ).first(),
    ).toBe(false);
  });

  const numbers = [1, 2, 3, 4];
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
  function isGreaterThenZero(value: number) {
    return value > 0;
  }
  test("from single", () => {
    expect(
      fromSingle.every(isGreaterThenZero).first() satisfies boolean,
    ).toEqual(true);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .every(isGreaterThenZero)
        .first() satisfies Promise<boolean>),
    ).toStrictEqual(true);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .every(isGreaterThenZero)
        .first() satisfies Promise<boolean>),
    ).toStrictEqual(true);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises.resolve().every(isGreaterThenZero).first()) satisfies
        | boolean
        | Promise<boolean>,
    ).toStrictEqual(true);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.every(isGreaterThenZero).first() satisfies boolean,
    ).toStrictEqual(true);
  });

  test("from array", () => {
    expect(
      fromArray.every(isGreaterThenZero).first() satisfies boolean,
    ).toStrictEqual(true);
  });

  function isGreaterThan100(value: number) {
    return value > 100;
  }
  test("from empty", () => {
    expect(
      fromEmpty.every(isGreaterThan100).first() satisfies boolean,
    ).toStrictEqual(true);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .every(isGreaterThan100)
        .first() satisfies Promise<boolean>),
    ).toStrictEqual(true);
  });
});
