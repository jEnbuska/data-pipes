import { describe, expect, test } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";

describe("count", () => {
  const numbers = [1, 2, 3];
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
      await (fromResolvedPromises.count().resolve() satisfies Promise<number>),
    ).toBe(numbers.length);
  });

  test("from async generator", async () => {
    expect((await fromAsyncGenerator.count().resolve()) satisfies number).toBe(
      numbers.length,
    );
  });

  test("from promises", async () => {
    expect(
      (await fromPromises.toAwaited().count().resolve()) satisfies number,
    ).toBe(numbers.length);
  });

  test("from generator", () => {
    expect(fromGenerator.count().resolve() satisfies number).toBe(
      numbers.length,
    );
  });

  test("from array", () => {
    expect(fromArray.count().resolve() satisfies number).toBe(numbers.length);
  });

  test("from empty", () => {
    expect(fromEmpty.count().resolve() satisfies number).toBe(0);
  });

  test("from empty async", async () => {
    expect((await fromEmptyAsync.count().resolve()) satisfies number).toBe(0);
  });
});
