import { expect, test, describe } from "bun:test";
import { first } from "../consumers/first.ts";
import { chain } from "../index.ts";
import { type GeneratorProvider } from "../types.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("first", () => {
  test("iterable to first", () => {
    function* source() {
      yield 1;
    }
    expect(first()(source())).toBe(1);
  });

  test("none to first", () => {
    function* source() {}
    expect(() => first()(source())).toThrow("No items in generator");
  });

  test("none to first defaultValue", () => {
    function* source(): GeneratorProvider<number> {}
    const value: string | number = first("default")(source());
    expect(value).toBe("default");
  });

  test("delegated iterable to first", () => {
    function* source() {
      yield* [1, 2, 3];
    }
    expect(first()(source())).toBe(1);
  });
  test("expect generator next to be called only once", () => {
    let last = 0;
    function* source() {
      yield (last = 1);
      yield (last = 2);
    }
    expect(last).toBe(0);
    first()(source());
    expect(last).toBe(1);
  });

  test("chain to first", () => {
    expect(chain([1, 2]).first()).toBe(1);
  });

  test("pipe none first", () => {
    expect(() => chain([]).first()).toThrow("No items in generator");
  });

  test("pipe none with default to first", () => {
    expect(chain([]).defaultIfEmpty("None").first()).toBe("None");
  });

  test("get first from async generator", async () => {
    expect(
      (await chain(async function* () {
        yield 1;
        yield 2;
      }).first()) satisfies number,
    ).toBe(1);
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
    expect(fromSingle.first() satisfies number).toEqual(numbers[0]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.first() satisfies Promise<number>),
    ).toStrictEqual(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.first() satisfies Promise<number>),
    ).toStrictEqual(numbers[0]);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises.first()) satisfies number | Promise<number>,
    ).toStrictEqual(numbers[0]);
  });

  test("from generator", async () => {
    expect(fromGenerator.first() satisfies number).toStrictEqual(numbers[0]);
  });

  test("from array", () => {
    expect(fromArray.first() satisfies number).toStrictEqual(numbers[0]);
  });

  test("from empty", () => {
    expect(fromEmpty.first(-1) satisfies number).toStrictEqual(-1);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.first(-1) satisfies Promise<number>),
    ).toStrictEqual(-1);
  });
});
