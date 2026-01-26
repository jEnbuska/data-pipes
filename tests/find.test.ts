import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("find", () => {
  test("find first", () => {
    expect(Yielded.from([1, 2, 3]).find((it) => it === 1)).toStrictEqual(1);
  });

  test("find second", () => {
    expect(
      Yielded.from([1, 2, 3]).find((it) => it === 2) satisfies
        | number
        | undefined,
    ).toStrictEqual(2);
  });

  test("find last", () => {
    expect(Yielded.from([1, 2, 3]).find((it) => it === 3)).toStrictEqual(3);
  });

  test("find none", () => {
    expect(Yielded.from([1, 2, 3]).find((it) => it === 4)).toStrictEqual(
      undefined,
    );
  });

  test("find with type-guard", () => {
    expect(
      Yielded.from([1, 2, 3]).find((it): it is 1 => it === 1) satisfies
        | 1
        | undefined,
    ).toStrictEqual(1);
  });

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

  function find2(value: number) {
    return value === 2;
  }
  test("from single", () => {
    expect(fromSingle.find(find2) satisfies void | number).toBe(undefined);
  });

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.find(find2) satisfies Promise<number | void>),
    ).toBe(2);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.find(find2) satisfies Promise<number | void>),
    ).toBe(2);
  });

  test("from promises", async () => {
    expect(
      await (fromPromises.awaited().find(find2) satisfies Promise<
        void | number
      >),
    ).toBe(2);
  });

  test("from generator", async () => {
    expect(fromGenerator.find(find2) satisfies number | void).toBe(2);
  });

  test("from array", () => {
    expect(fromArray.find(find2) satisfies number | void).toBe(2);
  });

  test("from empty", () => {
    expect(fromEmpty.find(find2) satisfies number | void).toBe(undefined);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.find(find2) satisfies Promise<void | number>),
    ).toBe(undefined);
  });
});
