import { describe, test, expect } from "bun:test";
import yielded from "../";

describe("take", () => {
  test("take 1", () => {
    expect(yielded([1, 2, 3]).take(1).collect()).toStrictEqual([1]);
  });
  test("take 2", () => {
    expect(yielded([1, 2, 3]).take(2).collect()).toStrictEqual([1, 2]);
  });

  test("take 2 async", async () => {
    expect(await yielded([1, 2, 3]).resolve().take(2).collect()).toStrictEqual([
      1, 2,
    ]);
  });

  test("take none", () => {
    expect(yielded([1, 2, 3]).take(0).collect()).toStrictEqual([]);
  });

  test("take negative", () => {
    expect(yielded([1, 2, 3]).take(-1).collect()).toStrictEqual([]);
  });
});
