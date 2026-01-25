import { describe, expect, test } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";

describe("maxBy", () => {
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
      await (fromResolvedPromises.maxBy(modulo4) satisfies Promise<
        number | void
      >),
    ).toStrictEqual(3);
  });

  test("from single", () => {
    expect(fromSingle.map(modulo4).first()).toEqual(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.maxBy(modulo4) satisfies Promise<
        number | undefined
      >),
    ).toStrictEqual(3);
  });

  test("from promises", async () => {
    const first = fromPromises.awaited().maxBy(modulo4) satisfies Promise<
      number | void
    >;
    expect(await first).toStrictEqual(3);
  });

  test("from generator", async () => {
    expect(fromGenerator.maxBy(modulo4) satisfies number | void).toStrictEqual(
      3,
    );
  });

  test("from array", () => {
    expect(fromArray.maxBy(modulo4) satisfies number | void).toStrictEqual(3);
  });

  test("from empty", () => {
    expect(fromEmpty.maxBy(modulo4) satisfies number | void).toStrictEqual(
      undefined,
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.maxBy(modulo4) satisfies Promise<number | void>),
    ).toStrictEqual(undefined);
  });
});
