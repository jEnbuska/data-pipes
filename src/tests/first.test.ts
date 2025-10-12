import { expect, test, describe } from "bun:test";
import { first } from "../consumers/first.ts";
import source from "../index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("first", () => {
  test("iterable to first", () => {
    function* source() {
      yield 1;
    }
    expect(first()(source())).toBe(1);
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
    expect(source([1, 2]).first()).toBe(1);
  });

  test("none with default to first", () => {
    expect(source([]).defaultIfEmpty("None").first()).toBe("None");
  });

  test("get first from async generator", async () => {
    expect(
      (await source(async function* () {
        yield 1;
        yield 2;
      }).first()) satisfies number | void,
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
    expect(fromSingle.first() satisfies number | void).toEqual(numbers[0]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.first() satisfies Promise<number | void>),
    ).toBe(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.first() satisfies Promise<number | void>),
    ).toBe(numbers[0]);
  });

  test("from promises", async () => {
    expect((await fromPromises.first()) satisfies number | void).toBe(
      numbers[0],
    );
  });

  test("from generator", async () => {
    expect(fromGenerator.first() satisfies number | void).toBe(numbers[0]);
  });

  test("from array", () => {
    expect(fromArray.first() satisfies number | void).toBe(numbers[0]);
  });

  test("from empty", () => {
    expect(fromEmpty.first() satisfies number | void).toBe(undefined);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.first() satisfies Promise<number | void>),
    ).toBe(undefined);
  });
});
