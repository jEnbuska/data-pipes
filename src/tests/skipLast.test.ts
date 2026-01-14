import { describe, test, expect } from "vitest";
import yielded from "../index.ts";

describe("skipLast", () => {
  test("skip last when array is empty", () => {
    expect(yielded([]).skipLast(3).resolve()).toStrictEqual([]);
  });

  test("when count is more than number of inputs", () => {
    expect(yielded([1, 2]).skipLast(3).resolve()).toStrictEqual([]);
  });
  test("when count is same as than number of inputs", () => {
    expect(yielded([1, 2, 3]).skipLast(3).resolve()).toStrictEqual([]);
  });
  test("when count is 1 less than as than number of inputs", () => {
    expect(yielded([1, 2, 3]).skipLast(2).resolve()).toStrictEqual([1]);
  });
  test("when count less than as than number of inputs", () => {
    let lastEmitted: number | undefined;
    const emittedBySkipLast: Array<{ after?: number; value: number }> = [];
    yielded([1, 2, 3, 4, 5])
      .tap((n) => {
        lastEmitted = n;
      })
      .skipLast(2)
      .tap((n) => {
        emittedBySkipLast.push({ after: lastEmitted, value: n });
      })
      .consume();
    expect(emittedBySkipLast).toStrictEqual([
      { after: 3, value: 1 },
      { after: 4, value: 2 },
      { after: 5, value: 3 },
    ]);
  });
});
