import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("find", () => {
  test("find first", () => {
    expect(
      chainable
        .from(1, 2, 3)
        .find((it) => it === 1)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("find second", () => {
    expect(
      chainable
        .from(1, 2, 3)
        .find((it) => it === 2)
        .toArray(),
    ).toStrictEqual([2]);
  });

  test("find last", () => {
    expect(
      chainable
        .from(1, 2, 3)
        .find((it) => it === 3)
        .toArray(),
    ).toStrictEqual([3]);
  });

  test("find none", () => {
    expect(
      chainable
        .from(1, 2, 3)
        .find((it) => it === 4)
        .toArray(),
    ).toStrictEqual([]);
  });
});
