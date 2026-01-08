import { describe, test, expect } from "bun:test";

import { createTestSets } from "./utils/createTestSets";

describe("defaultTo", () => {
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
    expect(fromSingle.defaultTo(() => 0).first() satisfies number).toEqual(
      numbers[0],
    );
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .defaultTo(() => 0)
        .first() satisfies Promise<number>),
    ).toStrictEqual(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .defaultTo(() => 0)
        .first() satisfies Promise<number>),
    ).toStrictEqual(numbers[0]);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises.defaultTo(() => 0).first()) satisfies number,
    ).toStrictEqual(numbers[0]);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.defaultTo(() => 0).first() satisfies number,
    ).toStrictEqual(numbers[0]);
  });

  test("from array", () => {
    expect(fromArray.defaultTo(() => 0).first() satisfies number).toStrictEqual(
      numbers[0],
    );
  });

  test("from empty", () => {
    expect(fromEmpty.defaultTo(() => 0).first() satisfies number).toStrictEqual(
      0,
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.defaultTo(() => 0).first() satisfies Promise<
        number | void
      >),
    ).toStrictEqual(0);
  });
});
