import { describe, test, expect } from "bun:test";
import { createTestSets } from "./utils/createTestSets";

describe("max", () => {
  const numbers = [2, 1, 3, 5, 4];
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
  const modulo4 = (n: number) => n % 4;

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.max(modulo4).collect() satisfies Promise<
        number | void
      >),
    ).toStrictEqual(3);
  });

  test("from single", () => {
    expect(fromSingle.map(modulo4).collect()).toEqual(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.max(modulo4).collect() satisfies Promise<
        number | undefined
      >),
    ).toStrictEqual(3);
  });

  test("from promises", async () => {
    const first = fromPromises
      .resolve()
      .max(modulo4)
      .collect() satisfies Promise<number | void>;
    expect(await first).toStrictEqual(3);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.max(modulo4).collect() satisfies number | void,
    ).toStrictEqual(3);
  });

  test("from array", () => {
    expect(
      fromArray.max(modulo4).collect() satisfies number | void,
    ).toStrictEqual(3);
  });

  test("from empty", () => {
    expect(
      fromEmpty.max(modulo4).collect() satisfies number | void,
    ).toStrictEqual(undefined);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.max(modulo4).collect() satisfies Promise<
        number | void
      >),
    ).toStrictEqual(undefined);
  });
});
