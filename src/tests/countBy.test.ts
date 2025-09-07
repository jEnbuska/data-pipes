import { describe, test, expect } from "bun:test";
import { chain } from "../chainable/chain.ts";
import { pipe } from "../pipe/pipe.ts";
import { countBy } from "../generators/countBy.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("countBy", () => {
  test("countBy with empty", () => {
    expect(
      chain<number>([])
        .countBy((next) => next)
        .first(),
    ).toBe(0);
  });
  test("countBy with identity", () => {
    expect(
      chain(1)
        .countBy((next) => next)
        .first(),
    ).toBe(1);
  });

  test("countBy by with selector identity", () => {
    expect(
      chain({ value: 5 })
        .countBy((next) => next.value)
        .first(),
    ).toBe(5);
  });

  test("pipe - countBy", () => {
    const value = pipe(
      [1, 2, 3],
      countBy((next) => next),
    ).first();
    expect(value).toBe(6);
  });

  const objects = [{ value: 1 }, { value: 2 }, { value: 3 }];
  const {
    fromResolvedPromises,
    fromSingle,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(objects);
  test("from single", () => {
    expect(
      fromSingle.countBy((next) => next.value).first() satisfies number,
    ).toEqual(objects[0].value);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .countBy((next) => next.value)
        .first() satisfies Promise<number>),
    ).toStrictEqual(6);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .countBy((next) => next.value)
        .first() satisfies Promise<number>),
    ).toStrictEqual(6);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises
        .resolve()
        .countBy((next) => next.value)
        .first()) satisfies number | Promise<number>,
    ).toStrictEqual(6);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.countBy((next) => next.value).first() satisfies number,
    ).toStrictEqual(6);
  });

  test("from array", () => {
    expect(
      fromArray.countBy((next) => next.value).first() satisfies number,
    ).toStrictEqual(6);
  });

  test("from empty", () => {
    expect(
      fromEmpty.countBy((next) => next.value).first() satisfies number,
    ).toStrictEqual(0);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .countBy((next) => next.value)
        .first() satisfies Promise<number>),
    ).toStrictEqual(0);
  });
});
