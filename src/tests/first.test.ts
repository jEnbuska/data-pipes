import { expect, test, describe } from "bun:test";
import source from "../index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("first", () => {
  test("chain to first", () => {
    expect(source([1, 2]).first() satisfies number | undefined).toBe(1);
  });
  describe("empty", () => {
    test("first with no default", () => {
      expect(source([] as string[]).first() satisfies string | undefined).toBe(
        undefined,
      );
    });
    test("defaultTo", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([])
          .defaultTo(() => "None")
          .first(controller.signal)
          .split("") satisfies string[],
      ).toStrictEqual("None".split(""));
    });
    test("map", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([""])
          .map(() => "None")
          .first(controller.signal) satisfies string | undefined,
      ).toBe(undefined);
    });
    test("filter", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([""])
          .filter(() => true)
          .first(controller.signal) satisfies string | undefined,
      ).toBe(undefined);
    });
    test("filter", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([[""]])
          .flat()
          .first(controller.signal) satisfies string | undefined,
      ).toBe(undefined);
    });

    test("fold", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([] as string[])
          .fold(
            (): string[] => [],
            (acc, next) => [...acc, next],
          )
          .first(controller.signal) satisfies string[],
      ).toStrictEqual([]);
    });

    test("reduce", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([] as string[])
          .reduce(
            (acc: Partial<Record<string, string>>, next) => ({
              ...acc,
              [next]: next,
            }),
            {} satisfies Partial<Record<string, string>>,
          )
          .first(controller.signal) satisfies Partial<Record<string, string>>,
      ).toStrictEqual({});
    });

    test("count", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([""] as string[])
          .count()
          .first(controller.signal) satisfies number,
      ).toBe(0);
    });

    test("every", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([""] as string[])
          .every(Boolean)
          .first(controller.signal) satisfies boolean,
      ).toBe(true);
    });
    test("every", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([""] as string[])
          .every(Boolean)
          .first(controller.signal) satisfies boolean,
      ).toBe(true);
    });
    test("some", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source(["abc"] as string[])
          .some(Boolean)
          .first(controller.signal) satisfies boolean,
      ).toBe(false);
    });
    test("batch", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source(["abc"] as string[])
          .batch(() => true)
          .first(controller.signal) satisfies string[],
      ).toStrictEqual([]);
    });
    test("chunkBy", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source(["abc"] as string[])
          .chunkBy(() => true)
          .first(controller.signal) satisfies string[],
      ).toStrictEqual([]);
    });
    test("resolve", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([Promise.resolve("")])
          .resolve()
          .first(controller.signal) satisfies Promise<string | undefined>,
      ).toBe(undefined);
    });
    test("resolve with default", async () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        (await source(Promise.resolve(""))
          .defaultTo(() => Promise.resolve("Placeholder"))
          .resolve()
          .first(controller.signal)) satisfies string,
      ).toBe("Placeholder");
    });
    test("resolve with default", () => {
      const controller = new AbortController();
      controller.abort();
      expect(
        source([""]).find(Boolean).first(controller.signal) satisfies
          | string
          | undefined,
      ).toBe(undefined);
    });
  });
  test("get first from async generator", async () => {
    expect(
      (await source(async function* () {
        yield 1;
        yield 2;
      }).first()) satisfies number | undefined,
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
    expect(fromSingle.first() satisfies number | undefined).toEqual(numbers[0]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.first() satisfies Promise<
        number | undefined
      >),
    ).toBe(numbers[0]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.first() satisfies Promise<number | undefined>),
    ).toBe(numbers[0]);
  });

  test("from promises", async () => {
    expect((await fromPromises.first()) satisfies number | undefined).toBe(
      numbers[0],
    );
  });

  test("from generator", async () => {
    expect(fromGenerator.first() satisfies number | undefined).toBe(numbers[0]);
  });

  test("from array", () => {
    expect(fromArray.first() satisfies number | undefined).toBe(numbers[0]);
  });

  test("from empty", () => {
    expect(fromEmpty.first() satisfies number | undefined).toBe(undefined);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.first() satisfies Promise<number | void>),
    ).toBe(undefined);
  });
});
