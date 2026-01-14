import { describe, test, expect } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";
import yielded from "../index.ts";

describe("find", () => {
  test("find first", () => {
    expect(
      yielded([1, 2, 3])
        .find((it) => it === 1)
        .resolve(),
    ).toStrictEqual(1);
  });

  test("find second", () => {
    expect(
      yielded([1, 2, 3])
        .find((it) => it === 2)
        .resolve() satisfies number | undefined,
    ).toStrictEqual(2);
  });

  test("find last", () => {
    expect(
      yielded([1, 2, 3])
        .find((it) => it === 3)
        .resolve(),
    ).toStrictEqual(3);
  });

  test("find none", () => {
    expect(
      yielded([1, 2, 3])
        .find((it) => it === 4)
        .resolve(),
    ).toStrictEqual(undefined);
  });

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

  function find2(value: number) {
    return value === 2;
  }
  test("from single", () => {
    expect(fromSingle.find(find2).resolve() satisfies void | number).toBe(
      undefined,
    );
  });

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.find(find2).resolve() satisfies Promise<
        number | void
      >),
    ).toBe(2);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.find(find2).resolve() satisfies Promise<
        number | void
      >),
    ).toBe(2);
  });

  test("from promises", async () => {
    expect(
      await (fromPromises.toAwaited().find(find2).resolve() satisfies Promise<
        void | number
      >),
    ).toBe(2);
  });

  test("from generator", async () => {
    expect(fromGenerator.find(find2).resolve() satisfies number | void).toBe(2);
  });

  test("from array", () => {
    expect(fromArray.find(find2).resolve() satisfies number | void).toBe(2);
  });

  test("from empty", () => {
    expect(fromEmpty.find(find2).resolve() satisfies number | void).toBe(
      undefined,
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.find(find2).resolve() satisfies Promise<
        void | number
      >),
    ).toBe(undefined);
  });
});
