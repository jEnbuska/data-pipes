import { describe, test, expect } from "bun:test";
import { chain, groupBy } from "../index.ts";
import { pipe } from "../pipe.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("groupBy", () => {
  describe("identity", () => {
    const expected = {
      1: [1],
      2: [2],
      3: [3],
    };
    test("pipe", () => {
      const groups = pipe(
        [1, 2, 3],
        groupBy((x) => x),
      ).first();
      expect(groups).toStrictEqual(expected);
    });

    test("chainable", () => {
      const groups = chain([1, 2, 3])
        .groupBy((x) => x)
        .first();
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
      const groups = chain([1, 2, 3])
        .groupBy((x) => x, [1, 2, 4])
        .first();
      expect(groups).toStrictEqual(expected);
    });

    test("pipe", () => {
      const groups = pipe(
        [1, 2, 3],
        groupBy((x) => x, [1, 2, 4]),
      ).first();
      expect(groups).toStrictEqual(expected);
    });
  });

  describe("module 2", () => {
    const expected = {
      1: [1, 3],
      0: [2, 4],
    };
    test("chainable", () => {
      const groups = chain([1, 2, 3, 4])
        .groupBy((x) => x % 2)
        .first();
      expect(groups).toStrictEqual(expected);
    });
    test("pipe", () => {
      const groups = pipe(
        [1, 2, 3, 4],
        groupBy((x) => x % 2),
      ).first();
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
      const groups = chain([1, 2, 3, 4])
        .groupBy((x) => (x % 2 ? "odd" : "even"), ["even", "other"])
        .first();
      expect(groups).toStrictEqual(expected);
    });
    test("pipe", () => {
      const groups = pipe(
        [1, 2, 3, 4],
        groupBy((x) => (x % 2 ? "odd" : "even"), ["even", "other"]),
      ).first();
      expect(groups).toStrictEqual(expected);
    });
  });

  describe("even without groups", () => {
    const expected = {
      odd: [1, 3],
      even: [2, 4],
    };
    test("chainable", () => {
      const groups = chain([1, 2, 3, 4])
        .groupBy((x) => (x % 2 ? "odd" : "even"))
        .first();
      expect(groups).toStrictEqual(expected);
    });

    test("pipe", () => {
      const groups = pipe(
        [1, 2, 3, 4],
        groupBy((x) => (x % 2 ? "odd" : "even")),
      ).first();
      expect(groups).toStrictEqual(expected);
    });
  });

  const getKey = (n: number) => (n % 2 ? "odd" : "even");
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
  type ExpectedReturnType = {
    odd: number[];
    even: number[];
  };
  test("from single", () => {
    expect(
      fromSingle.groupBy(getKey).first() satisfies ExpectedReturnType,
    ).toEqual({ odd: [1] });
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises
        .groupBy(getKey)
        .first() satisfies Promise<ExpectedReturnType>),
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator
        .groupBy(getKey)
        .first() satisfies Promise<ExpectedReturnType>),
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises.resolve().groupBy(getKey).first()) satisfies
        | ExpectedReturnType
        | Promise<ExpectedReturnType>,
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from generator", async () => {
    expect(
      fromGenerator.groupBy(getKey).first() satisfies ExpectedReturnType,
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from array", () => {
    expect(
      fromArray.groupBy(getKey).first() satisfies ExpectedReturnType,
    ).toStrictEqual({ odd: [1, 3], even: [2] });
  });

  test("from empty", () => {
    expect(
      fromEmpty.groupBy(getKey).first() satisfies ExpectedReturnType,
    ).toStrictEqual({});
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync
        .groupBy(getKey)
        .first() satisfies Promise<ExpectedReturnType>),
    ).toStrictEqual({});
  });
});
