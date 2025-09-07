import { describe, test, expect } from "bun:test";
import { chain } from "../index.ts";

describe("sort", () => {
  test("sort numbers", () => {
    expect(
      chain([3, 1, 2])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort single", () => {
    expect(
      chain(1)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("sort empty", () => {
    expect(
      chain<number>([])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([]);
  });
});
