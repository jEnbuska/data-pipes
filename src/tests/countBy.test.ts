import { describe, test, expect } from "bun:test";
import { createTestSets } from "./utils/createTestSets.ts";
import { streamless } from "../";

describe("countBy", () => {
  test("countBy with empty", () => {
    expect(
      streamless<number>([])
        .countBy((next) => next)
        .first(),
    ).toBe(0);
  });
  test("countBy with identity", () => {
    expect(
      streamless(1)
        .countBy((next) => next)
        .first(),
    ).toBe(1);
  });

  test("countBy by with selector identity", () => {
    expect(
      streamless({ value: 5 })
        .countBy((next) => next.value)
        .first(),
    ).toBe(5);
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
      fromSingle.countBy((next) => next.value).first() satisfies number | void,
    ).toEqual(objects[0].value);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .countBy((next) => next.value)
        .first() satisfies Promise<number | void>),
    ).toBe(6);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .countBy((next) => next.value)
        .first() satisfies Promise<number | void>),
    ).toBe(6);
  });

  test("from promises", async () => {
    expect(
      await fromPromises
        .resolve()
        .countBy((next) => next.value)
        .first(),
    ).toBe(6);
  });

  test("from generator", async () => {
    expect(
      fromGenerator.countBy((next) => next.value).first() satisfies
        | number
        | void,
    ).toBe(6);
  });

  test("from array", () => {
    expect(
      fromArray.countBy((next) => next.value).first() satisfies number | void,
    ).toBe(6);
  });

  test("from empty", () => {
    expect(
      fromEmpty.countBy((next) => next.value).first() satisfies number | void,
    ).toBe(0);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .countBy((next) => next.value)
        .first() satisfies Promise<number | void>),
    ).toBe(0);
  });
});
