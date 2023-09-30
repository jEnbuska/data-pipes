import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("sort", () => {
  test("sort numbers", () => {
    expect(
      chainable
        .from(3, 1, 2)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort single", () => {
    expect(
      chainable
        .from(1)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("sort empty", () => {
    expect(
      chainable
        .from<number>()
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([]);
  });
});
