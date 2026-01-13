import { describe, test, expect } from "bun:test";
import { createTestSets } from "./utils/createTestSets";

describe("map", () => {
  const {
    fromResolvedPromises,
    fromSingle,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets([2, 1, 3, 5, 4]);
  const expected = [2, 1, 3, 1, 0];
  const modulo4 = (n: number) => n % 4;
  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.map(modulo4).collect() satisfies Promise<
        number[]
      >),
    ).toStrictEqual(expected);
  });

  test("from single", () => {
    expect(fromSingle.map(modulo4).collect() satisfies number | void).toEqual(
      expected[0],
    );
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.map(modulo4).collect() satisfies Promise<
        number[]
      >),
    ).toStrictEqual(expected);
  });

  test("from promises", async () => {
    const first = fromPromises
      .resolve()
      .map(modulo4)
      .collect() satisfies Promise<number[]>;
    expect(await first).toStrictEqual(expected);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.map(modulo4).collect() satisfies number[],
    ).toStrictEqual(expected);
  });

  test("from array", () => {
    expect(fromArray.map(modulo4).collect() satisfies number[]).toStrictEqual(
      expected,
    );
  });

  test("from empty", () => {
    expect(fromEmpty.map(modulo4).collect() satisfies number[]).toStrictEqual(
      [],
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.map(modulo4).collect() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
