import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("batch", () => {
  test("batch sync", () => {
    const result = Yielded.from([1, 2, 3, 4, 5])
      .batch((acc) => acc.length >= 2)
      .toArray() satisfies number[][];

    expect(result).toStrictEqual([[1, 2], [3, 4], [5]]);
  });
});
