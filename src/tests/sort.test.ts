import { describe, test, expect } from "bun:test";
import source from "../index.ts";

describe("sort", () => {
  test("sort numbers", () => {
    expect(
      source([3, 1, 2])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort single", () => {
    expect(
      source(1)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("sort empty", () => {
    expect(
      source<number>([])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([]);
  });
});
