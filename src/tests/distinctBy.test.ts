import { describe, test, expect } from "bun:test";
import { createTestSets } from "./utils/createTestSets.ts";
import { streamless } from "../";

describe("distinctBy", () => {
  const module2Predicate = (it: number) => it % 2;
  test("empty", () => {
    expect(
      streamless([])
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      streamless([1, 2, 3])
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("by module 2", () => {
    expect(
      streamless([1, 2, 3, 4])
        .distinctBy((it) => it % 2)
        .toArray(),
    ).toStrictEqual([1, 2]);
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
  test("from single", () => {
    expect(
      fromSingle.distinctBy(module2Predicate).toArray() satisfies number[],
    ).toEqual([numbers[0]]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .distinctBy(module2Predicate)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .distinctBy(module2Predicate)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2]);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises
        .resolve()
        .distinctBy(module2Predicate)
        .toArray()) satisfies number[],
    ).toStrictEqual([1, 2]);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.distinctBy(module2Predicate).toArray() satisfies number[],
    ).toStrictEqual([1, 2]);
  });

  test("from array", () => {
    expect(
      fromArray.distinctBy(module2Predicate).toArray() satisfies number[],
    ).toStrictEqual([1, 2]);
  });

  test("from empty", () => {
    expect(
      fromEmpty.distinctBy(module2Predicate).toArray() satisfies number[],
    ).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .distinctBy(module2Predicate)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
