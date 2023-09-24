import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("take", () => {
  test("take 1", () => {
    expect(pipe(1, 2, 3).take(1).toArray()).toStrictEqual([1]);
  });
  test("take 2", () => {
    expect(pipe(1, 2, 3).take(2).toArray()).toStrictEqual([1, 2]);
  });

  test("take none", () => {
    expect(pipe(1, 2, 3).take(0).toArray()).toStrictEqual([]);
  });

  test("take negative", () => {
    expect(pipe(1, 2, 3).take(-1).toArray()).toStrictEqual([]);
  });
});
