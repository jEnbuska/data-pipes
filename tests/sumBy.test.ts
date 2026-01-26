import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("sumBy", () => {
  test("sumBy with empty", () => {
    expect(Yielded.from<number>([]).sumBy((next) => next)).toBe(0);
  });

  const objects = [{ value: 1 }, { value: 2 }, { value: 3 }];
  const {
    fromResolvedPromises,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(objects);

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.sumBy(
        (next) => next.value,
      ) satisfies Promise<number>),
    ).toBe(6);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.sumBy(
        (next) => next.value,
      ) satisfies Promise<number>),
    ).toBe(6);
  });

  test("from promises", async () => {
    expect(await fromPromises.awaited().sumBy((next) => next.value)).toBe(6);
  });

  test("from generator", async () => {
    expect(fromGenerator.sumBy((next) => next.value) satisfies number).toBe(6);
  });

  test("from array", () => {
    expect(fromArray.sumBy((next) => next.value) satisfies number).toBe(6);
  });

  test("from empty", () => {
    expect(fromEmpty.sumBy((next) => next.value) satisfies number).toBe(0);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.sumBy(
        (next) => next.value,
      ) satisfies Promise<number>),
    ).toBe(0);
  });
});
