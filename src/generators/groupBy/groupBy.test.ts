import { describe, test, expect } from "bun:test";
import { chainable } from "../../index.ts";

describe("groupBy", () => {
  test("group by identity", () => {
    const array = chainable
      .from(1, 2, 3)
      .groupBy((x) => x)
      .toSingle();
    expect(array).toStrictEqual({
      1: [1],
      2: [2],
      3: [3],
    });
  });

  test("group by with predefined groups", () => {
    const array = chainable
      .from(1, 2, 3)
      .groupBy((x) => x, [1, 2, 4])
      .toSingle();
    expect(array).toStrictEqual({
      1: [1],
      2: [2],
      4: [],
    });
  });

  test("group by module 2", () => {
    const array = chainable
      .from(1, 2, 3, 4)
      .groupBy((x) => x % 2)
      .toSingle();
    expect(array).toStrictEqual({
      1: [1, 3],
      0: [2, 4],
    });
  });
});
