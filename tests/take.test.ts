import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("take", () => {
  test("take 1", () => {
    expect(Yielded.from([1, 2, 3]).take(1).toArray()).toStrictEqual([1]);
  });
  test("take 2", () => {
    expect(Yielded.from([1, 2, 3]).take(2).toArray()).toStrictEqual([1, 2]);
  });

  test("take 2 async", async () => {
    expect(
      await Yielded.from([1, 2, 3]).awaited().take(2).toArray(),
    ).toStrictEqual([1, 2]);
  });

  test("take none", () => {
    expect(Yielded.from([1, 2, 3]).take(0).toArray()).toStrictEqual([]);
  });

  test("take negative", () => {
    expect(Yielded.from([1, 2, 3]).take(-1).toArray()).toStrictEqual([]);
  });
});
