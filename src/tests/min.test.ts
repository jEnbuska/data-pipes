import { describe, test, expect } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";

describe("min", () => {
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
      await (fromResolvedPromises.min(modulo4).resolve() satisfies Promise<
        number | void
      >),
    ).toBe(4);
  });

  test("from single", () => {
    expect(fromSingle.resolve() satisfies number | undefined).toEqual(
      numbers[0],
    );
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.min(modulo4).resolve() satisfies Promise<
        number | void
      >),
    ).toBe(4);
  });

  test("from promises", async () => {
    const first = fromPromises
      .toAwaited()
      .min(modulo4)
      .resolve() satisfies Promise<number | void>;
    expect(await first).toBe(4);
  });

  test("from generator", async () => {
    expect(fromGenerator.min(modulo4).resolve() satisfies number | void).toBe(
      4,
    );
  });

  test("from array", () => {
    expect(fromArray.min(modulo4).resolve() satisfies number | void).toBe(4);
  });

  test("from empty", () => {
    expect(fromEmpty.min(modulo4).resolve() satisfies number | void).toBe(
      undefined,
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.min(modulo4).resolve() satisfies Promise<
        number | void
      >),
    ).toBe(undefined);
  });
});
