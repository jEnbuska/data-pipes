import { describe, expect, test } from "vitest";
import yielded from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("groupBy", () => {
  describe("identity", () => {
    const expected = {
      1: [1],
      2: [2],
      3: [3],
    };

    test("chainable", () => {
      const groups = yielded([1, 2, 3]).groupBy((x) => x);
      expect(groups).toStrictEqual(expected);
    });
  });

  describe("identity with groups", () => {
    const expected = {
      1: [1],
      2: [2],
      3: [3],
      4: [],
    };
    test("chainable", () => {
      const groups = yielded([1, 2, 3]).groupBy((x) => x, [1, 2, 4]);
      expect(groups).toStrictEqual(expected);
    });
  });

  describe("module 2", () => {
    const expected = {
      1: [1, 3],
      0: [2, 4],
    };
    test("chainable", () => {
      const groups = yielded([1, 2, 3, 4]).groupBy((x) => x % 2);
      expect(groups).toStrictEqual(expected);
    });
  });

  describe("even odd with groups", () => {
    const expected = {
      odd: [1, 3],
      even: [2, 4],
      other: [],
    };
    test("chainable", () => {
      const groups = yielded([1, 2, 3, 4]).groupBy(
        (x) => (x % 2 ? "odd" : "even"),
        ["even", "other"],
      ) satisfies Record<"even" | "other", number[]> &
        Partial<Record<"odd", number[]>>;
      expect(groups).toStrictEqual(expected);
    });
  });

  describe("even without groups", () => {
    const expected = {
      odd: [1, 3],
      even: [2, 4],
    };
    test("chainable", () => {
      const groups = yielded([1, 2, 3, 4]).groupBy((x) =>
        x % 2 ? "odd" : "even",
      );
      expect(groups).toStrictEqual(expected);
    });
  });

  const getKey = (n: number) => (n % 2 ? "odd" : "even");
  const numbers = [1, 2, 3];
  const {
    fromResolvedPromises,
    fromAsyncGenerator,
    fromGenerator,
    fromPromises,
    fromArray,
    fromEmpty,
    fromEmptyAsync,
  } = createTestSets(numbers);
  type ExpectedReturnType = {
    odd: number[];
    even: number[];
  };

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.groupBy(getKey) satisfies Promise<
        Partial<ExpectedReturnType> | undefined
      >),
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.groupBy(getKey) satisfies Promise<
        Partial<ExpectedReturnType> | undefined
      >),
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from promises", async () => {
    expect(
      (await fromPromises.awaited().groupBy(getKey)) satisfies
        | Partial<ExpectedReturnType>
        | undefined,
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from generator", () => {
    expect(
      fromGenerator.groupBy(
        getKey,
      ) satisfies Partial<ExpectedReturnType> | void,
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from array", () => {
    expect(
      fromArray.groupBy(getKey) satisfies Partial<ExpectedReturnType> | void,
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from empty", () =>
    expect(
      fromEmpty.groupBy(getKey) satisfies Partial<ExpectedReturnType> | void,
    ).toStrictEqual({});
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.groupBy(
        getKey,
      ) satisfies Promise<Partial<ExpectedReturnType> | void>),
    ).toStrictEqual({});
  });
});
