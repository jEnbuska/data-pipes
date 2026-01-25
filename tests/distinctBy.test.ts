import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("distinctBy", () => {
  const module2Predicate = (it: number) => it % 2;
  test("empty", () => {
    expect(
      Yielded.from([])
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      Yielded.from([1, 2, 3])
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("by module 2", () => {
    expect(
      Yielded.from([1, 2, 3, 4])
        .distinctBy((it) => it % 2)
        .toArray(),
    ).toStrictEqual([1, 2]);
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

  test("from resolved promises", async () => {
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
        .awaited()
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
