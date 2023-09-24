import { describe, test, expect } from "bun:test";
import pipe from "../../index.ts";

describe("sort", () => {
  test("sort numbers", () => {
    expect(
      pipe(3, 1, 2)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort single", () => {
    expect(
      pipe(1)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("sort empty", () => {
    expect(
      pipe<number>()
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([]);
  });
});
