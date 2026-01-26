import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("chunkBy", () => {
  test("chunkBy numbers sync", () => {
    const result = Yielded.from([1, 2, 3, 4, 5])
      .chunkBy((n) => n % 2)
      .toArray() satisfies number[][];

    expect(result).toStrictEqual([
      [1, 3, 5],
      [2, 4],
    ]);
  });

  test("chunkBy strings sync", () => {
    const result = Yielded.from(["apple", "banana", "apricot", "blueberry"])
      .chunkBy((fruit) => fruit[0])
      .toArray() satisfies string[][];
    expect(result).toStrictEqual([
      ["apple", "apricot"],
      ["banana", "blueberry"],
    ]);
  });
});
