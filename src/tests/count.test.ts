import { describe, expect, test } from "bun:test";
import { createTestSets } from "./utils/createTestSets.ts";

describe("count", () => {
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
  test("from single", () => {
    expect(fromSingle.count().first() satisfies number | void).toEqual(
      numbers[0],
    );
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.count().first() satisfies Promise<
        number | void
      >),
    ).toBe(numbers.length);
  });

  test("from async generator", async () => {
    expect(
      (await fromAsyncGenerator.count().first()) satisfies number | void,
    ).toBe(numbers.length);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises.resolve().count().first()) satisfies number | void,
    ).toBe(numbers.length);
  });

  test("from generator", () => {
    expect(fromGenerator.count().first() satisfies number | void).toBe(
      numbers.length,
    );
  });

  test("from array", () => {
    expect(fromArray.count().first() satisfies number | void).toBe(
      numbers.length,
    );
  });

  test("from empty", () => {
    expect(fromEmpty.count().first() satisfies number | void).toBe(0);
  });

  test("from empty async", async () => {
    expect((await fromEmptyAsync.count().first()) satisfies number | void).toBe(
      0,
    );
  });
});
