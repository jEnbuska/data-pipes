import { describe, test, expect } from "bun:test";
import { chainable, groupBy } from "../../index.ts";
import { pipe } from "../../pipe/pipe.ts";

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
      const groups = chainable([1, 2, 3])
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
      const groups = chainable([1, 2, 3])
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
      const groups = chainable([1, 2, 3, 4])
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
      const groups = chainable([1, 2, 3, 4])
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
      const groups: Partial<Record<"even" | "odd", number[]>> = chainable([
        1, 2, 3, 4,
      ])
        .groupBy((x) => (x % 2 ? "odd" : "even"))
        .first();
      expect(groups).toStrictEqual(expected);
    });

    test("pipe", () => {
      const groups: Partial<Record<"even" | "odd", number[]>> = pipe(
        [1, 2, 3, 4],
        groupBy((x) => (x % 2 ? "odd" : "even")),
      ).first();
      expect(groups).toStrictEqual(expected);
    });
  });
});
