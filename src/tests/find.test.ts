import { describe, test, expect } from "bun:test";
import { createTestSets } from "./utils/createTestSets";
import streamless from "../";

describe("find", () => {
  test("find first", () => {
    expect(
      streamless([1, 2, 3])
        .find((it) => it === 1)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("find second", () => {
    expect(
      streamless([1, 2, 3])
        .find((it) => it === 2)
        .toArray(),
    ).toStrictEqual([2]);
  });

  test("find last", () => {
    expect(
      streamless([1, 2, 3])
        .find((it) => it === 3)
        .toArray(),
    ).toStrictEqual([3]);
  });

  test("find none", () => {
    expect(
      streamless([1, 2, 3])
        .find((it) => it === 4)
        .toArray(),
    ).toStrictEqual([]);
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
    expect(fromSingle.find(find2).first() satisfies void | number).toBe(
      undefined,
    );
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.find(find2).first() satisfies Promise<
        number | void
      >),
    ).toBe(2);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.find(find2).first() satisfies Promise<
        number | void
      >),
    ).toBe(2);
  });

  test("from promises", async () => {
    expect(
      await (fromPromises.resolve().find(find2).first() satisfies Promise<
        void | number
      >),
    ).toBe(2);
  });

  test("from generator", async () => {
    expect(fromGenerator.find(find2).first() satisfies number | void).toBe(2);
  });

  test("from array", () => {
    expect(fromArray.find(find2).first() satisfies number | void).toBe(2);
  });

  test("from empty", () => {
    expect(fromEmpty.find(find2).first() satisfies number | void).toBe(
      undefined,
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.find(find2).first() satisfies Promise<
        void | number
      >),
    ).toBe(undefined);
  });
});
