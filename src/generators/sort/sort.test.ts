import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("sort", () => {
  test("sort numbers", () => {
    expect(
      chainable([3, 1, 2])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort single", () => {
    expect(
      chainable(1)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("sort empty", () => {
    expect(
      chainable<number>([])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([]);
  });
});
