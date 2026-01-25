import { describe, expect, test } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";

describe("minBy", () => {
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

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.minBy(modulo4) satisfies Promise<
        number | void
      >),
    ).toBe(4);
  });

  test("from single", () => {
    expect(fromSingle satisfies number | undefined).toEqual(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.minBy(modulo4) satisfies Promise<
        number | void
      >),
    ).toBe(4);
  });

  test("from promises", async () => {
    const first = fromPromises.awaited().minBy(modulo4) satisfies Promise<
      number | void
    >;
    expect(await first).toBe(4);
  });

  test("from generator", async () => {
    expect(fromGenerator.minBy(modulo4) satisfies number | void).toBe(4);
  });

  test("from array", () => {
    expect(fromArray.minBy(modulo4) satisfies number | void).toBe(4);
  });

  test("from empty", () => {
    expect(fromEmpty.minBy(modulo4) satisfies number | void).toBe(undefined);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.minBy(modulo4) satisfies Promise<number | void>),
    ).toBe(undefined);
  });
});
