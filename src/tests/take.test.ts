import { describe, test, expect } from "vitest";
import yielded from "../index.ts";

describe("take", () => {
  test("take 1", () => {
    expect(yielded([1, 2, 3]).take(1).resolve()).toStrictEqual([1]);
  });
  test("take 2", () => {
    expect(yielded([1, 2, 3]).take(2).resolve()).toStrictEqual([1, 2]);
  });

  test("take 2 async", async () => {
    expect(
      await yielded([1, 2, 3]).toAwaited().take(2).resolve(),
    ).toStrictEqual([1, 2]);
  });

  test("take none", () => {
    expect(yielded([1, 2, 3]).take(0).resolve()).toStrictEqual([]);
  });

  test("take negative", () => {
    expect(yielded([1, 2, 3]).take(-1).resolve()).toStrictEqual([]);
  });
});
