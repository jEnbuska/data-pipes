import { describe, expect, test } from "bun:test";
import { createTestSets } from "./utils/createTestSets";

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

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.count().collect() satisfies Promise<number>),
    ).toBe(numbers.length);
  });

  test("from async generator", async () => {
    expect((await fromAsyncGenerator.count().collect()) satisfies number).toBe(
      numbers.length,
    );
  });

  test("from promises", async () => {
    expect(
      (await fromPromises.resolve().count().collect()) satisfies number,
    ).toBe(numbers.length);
  });

  test("from generator", () => {
    expect(fromGenerator.count().collect() satisfies number).toBe(
      numbers.length,
    );
  });

  test("from array", () => {
    expect(fromArray.count().collect() satisfies number).toBe(numbers.length);
  });

  test("from empty", () => {
    expect(fromEmpty.count().collect() satisfies number).toBe(0);
  });

  test("from empty async", async () => {
    expect((await fromEmptyAsync.count().collect()) satisfies number).toBe(0);
  });
});
