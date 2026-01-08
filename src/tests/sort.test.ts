import { describe, test, expect } from "bun:test";
import { streamless } from "../";

describe("sort", () => {
  test("sort numbers", () => {
    expect(
      streamless([3, 1, 2])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort single", () => {
    expect(
      streamless(1)
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1]);
  });

  test("sort empty", () => {
    expect(
      streamless<number>([])
        .sort((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([]);
  });
});
