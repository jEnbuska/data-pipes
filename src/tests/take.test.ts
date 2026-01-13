import { describe, test, expect } from "bun:test";
import streamless from "../";

describe("take", () => {
  test("take 1", () => {
    expect(streamless([1, 2, 3]).take(1).collect()).toStrictEqual([1]);
  });
  test("take 2", () => {
    expect(streamless([1, 2, 3]).take(2).collect()).toStrictEqual([1, 2]);
  });

  test("take 2 async", async () => {
    expect(
      await streamless([1, 2, 3]).resolve().take(2).collect(),
    ).toStrictEqual([1, 2]);
  });

  test("take none", () => {
    expect(streamless([1, 2, 3]).take(0).collect()).toStrictEqual([]);
  });

  test("take negative", () => {
    expect(streamless([1, 2, 3]).take(-1).collect()).toStrictEqual([]);
  });
});
