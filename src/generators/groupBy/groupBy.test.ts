import { describe, test, expect } from "bun:test";
import { chainable, groupBy } from "../../index.ts";
import { pipe } from "../../pipe/pipe.ts";

describe("groupBy", () => {
  test("group by identity", () => {
    const array = chainable(1, 2, 3)
      .groupBy((x) => x)
      .first();
    expect(array).toStrictEqual({
      1: [1],
      2: [2],
      3: [3],
    });
  });

  test("group by with predefined groups", () => {
    const array = chainable(1, 2, 3)
      .groupBy((x) => x, [1, 2, 4])
      .first();
    expect(array).toStrictEqual({
      1: [1],
      2: [2],
      4: [],
    });
  });

  test("group by module 2", () => {
    const array = chainable(1, 2, 3, 4)
      .groupBy((x) => x % 2)
      .first();
    expect(array).toStrictEqual({
      1: [1, 3],
      0: [2, 4],
    });
  });

  test("chainable - group by even odd with predefined groups", () => {
    const array = chainable(1, 2, 3, 4)
      .groupBy((x) => (x % 2 ? "odd" : "even"), ["even", "never"])
      .first();
    expect(array).toStrictEqual({
      even: [2, 4],
      never: [],
    });
  });

  test("pipe - group by even odd with predefined groups", () => {
    const array = pipe(
      [1, 2, 3, 4],
      groupBy((x) => (x % 2 ? "odd" : "even"), ["even", "never"]),
    ).first();
    expect(array).toStrictEqual({
      even: [2, 4],
      never: [],
    });
  });

  test("chainable - group by even odd without predefined groups", () => {
    const array = chainable(1, 2, 3, 4)
      .groupBy((x) => (x % 2 ? "odd" : "even"))
      .first();
    expect(array).toStrictEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });

  test("pipe - group by even odd without predefined groups", () => {
    const array = pipe(
      [1, 2, 3, 4],
      groupBy((x) => (x % 2 ? "odd" : "even")),
    ).first();
    expect(array).toStrictEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });
});
