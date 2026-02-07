import { describe, expect, test } from "vitest";
import { createTestSets } from "../utils/createTestSets.ts";

describe("mapPairwise", () => {
  const {
    fromResolvedPromises,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets([2, 1, 3, 5, 4]);
  const expected = [3, 0, 0, 1];
  const modulo4 = (a: number, b: number) => (a + b) % 4;
  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises
        .mapPairwise(modulo4)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual(expected);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .mapPairwise(modulo4)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual(expected);
  });

  test("from promises", async () => {
    const first = fromPromises
      .awaited()
      .mapPairwise(modulo4)
      .toArray() satisfies Promise<number[]>;
    expect(await first).toStrictEqual(expected);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.mapPairwise(modulo4).toArray() satisfies number[],
    ).toStrictEqual(expected);
  });

  test("from array", () => {
    expect(
      fromArray.mapPairwise(modulo4).toArray() satisfies number[],
    ).toStrictEqual(expected);
  });

  test("from empty", () => {
    expect(
      fromEmpty.mapPairwise(modulo4).toArray() satisfies number[],
    ).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.mapPairwise(modulo4).toArray() satisfies Promise<
        number[]
      >),
    ).toStrictEqual([]);
  });
});
