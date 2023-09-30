import { describe, test, expect } from "bun:test";
import { chainable } from "../..";

describe("distinctBy", () => {
  test("empty", () => {
    expect(
      chainable
        .from()
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      chainable
        .from(1, 2, 3)
        .distinctBy((it) => it)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("by module 2", () => {
    expect(
      chainable
        .from(1, 2, 3, 4)
        .distinctBy((it) => it % 2)
        .toArray(),
    ).toStrictEqual([1, 2]);
  });
});
