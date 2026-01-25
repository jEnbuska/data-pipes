import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("countBy", () => {
  test("countBy with empty", () => {
    expect(Yielded.from<number>([]).countBy((next) => next)).toBe(0);
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
      await (fromResolvedPromises.countBy(
        (next) => next.value,
      ) satisfies Promise<number>),
    ).toBe(6);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.countBy(
        (next) => next.value,
      ) satisfies Promise<number>),
    ).toBe(6);
  });

  test("from promises", async () => {
    expect(await fromPromises.awaited().countBy((next) => next.value)).toBe(6);
  });

  test("from generator", async () => {
    expect(fromGenerator.countBy((next) => next.value) satisfies number).toBe(
      6,
    );
  });

  test("from array", () => {
    expect(fromArray.countBy((next) => next.value) satisfies number).toBe(6);
  });

  test("from empty", () => {
    expect(fromEmpty.countBy((next) => next.value) satisfies number).toBe(0);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.countBy(
        (next) => next.value,
      ) satisfies Promise<number>),
    ).toBe(0);
  });
});
