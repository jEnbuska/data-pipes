import { describe, test, expect } from "bun:test";
import { filter, defaultIfEmpty } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("defaultIfEmpty", () => {
  test("pipe - defaultIfEmpty", () => {
    const value = pipe(
      [1, 2, 3],
      filter((it) => it > 3),
      defaultIfEmpty(0),
    ).first();
    expect(value).toBe(0);
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
  test("from single", () => {
    expect(fromSingle.defaultIfEmpty(0).first() satisfies number).toEqual(
      numbers[0],
    );
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .defaultIfEmpty(0)
        .first() satisfies Promise<number>),
    ).toStrictEqual(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .defaultIfEmpty(0)
        .first() satisfies Promise<number>),
    ).toStrictEqual(numbers[0]);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises.defaultIfEmpty(0).first()) satisfies
        | number
        | Promise<number>,
    ).toStrictEqual(numbers[0]);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.defaultIfEmpty(0).first() satisfies number,
    ).toStrictEqual(numbers[0]);
  });

  test("from array", () => {
    expect(fromArray.defaultIfEmpty(0).first() satisfies number).toStrictEqual(
      numbers[0],
    );
  });

  test("from empty", () => {
    expect(fromEmpty.defaultIfEmpty(0).first() satisfies number).toStrictEqual(
      0,
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .defaultIfEmpty(0)
        .first() satisfies Promise<number>),
    ).toStrictEqual(0);
  });
});
