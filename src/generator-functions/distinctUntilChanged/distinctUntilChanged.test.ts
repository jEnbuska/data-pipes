import { describe, test, expect } from "bun:test";
import pipe from "../..";

describe("distinctUntilChanged", () => {
  test("empty ", () => {
    expect(pipe().distinctUntilChanged().toArray()).toStrictEqual([]);
  });

  test("all unique", () => {
    expect(
      pipe(1, 2, 3)
        .distinctUntilChanged((a, b) => a === b)
        .toArray(),
    ).toStrictEqual([1, 2, 3]);
  });

  test("similar consecutive values", () => {
    expect(
      pipe(1, 1, 2, 3, 3, 4).distinctUntilChanged().toArray(),
    ).toStrictEqual([1, 2, 3, 4]);
  });
});
