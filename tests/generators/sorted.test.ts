import { describe, expect, test } from "vitest";
import { Yielded } from "../../src/index.ts";

describe("sorted", () => {
  test("sort numbers", () => {
    expect(
      Yielded.from([3, 1, 2])
        .sorted((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("sort empty", () => {
    expect(
      Yielded.from<number>([])
        .sorted((a, z) => a - z)
        .toArray(),
    ).toStrictEqual([]);
  });
  test("sort resolver", async () => {
    expect(
      await (Yielded.from<number>([2, 1, 3])
        .map((value) => Promise.resolve(value))
        .awaited()
        .sorted((a, z) => a - z)
        .toArray() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 3]);
  });
});
