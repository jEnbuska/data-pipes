import { describe, test, expect } from "bun:test";
import { chain, find } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("find", () => {
  test("find first", () => {
    expect(
      chain([1, 2, 3])
        .find((it) => it === 1)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("find second", () => {
    expect(
      chain([1, 2, 3])
        .find((it) => it === 2)
        .toArray(),
    ).toStrictEqual([2]);
  });

  test("find last", () => {
    expect(
      chain([1, 2, 3])
        .find((it) => it === 3)
        .toArray(),
    ).toStrictEqual([3]);
  });

  test("find none", () => {
    expect(
      chain([1, 2, 3])
        .find((it) => it === 4)
        .toArray(),
    ).toStrictEqual([]);
  });

  test("pipe - find", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        find((n) => n > 2),
      ).toArray(),
    ).toStrictEqual([3]);
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
    expect(fromSingle.find(find2).first(-1) satisfies number).toEqual(-1);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .find(find2)
        .first() satisfies Promise<number>),
    ).toStrictEqual(2);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.find(find2).first() satisfies Promise<number>),
    ).toStrictEqual(2);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises.resolve().find(find2).first()) satisfies
        | number
        | Promise<number>,
    ).toStrictEqual(2);
  });

  test("from generator", async () => {
    expect(fromGenerator.find(find2).first() satisfies number).toStrictEqual(2);
  });

  test("from array", () => {
    expect(fromArray.find(find2).first() satisfies number).toStrictEqual(2);
  });

  test("from empty", () => {
    expect(fromEmpty.find(find2).first(-1) satisfies number).toStrictEqual(-1);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.find(find2).first(-1) satisfies Promise<number>),
    ).toStrictEqual(-1);
  });
});
