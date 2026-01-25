import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("dropLast", () => {
  test("drop last when array is empty", () => {
    expect(Yielded.from([]).dropLast(3).toArray()).toStrictEqual([]);
  });

  test("when count is more than number of inputs", () => {
    expect(Yielded.from([1, 2]).dropLast(3).toArray()).toStrictEqual([]);
  });
  test("when count is same as than number of inputs", () => {
    expect(Yielded.from([1, 2, 3]).dropLast(3).toArray()).toStrictEqual([]);
  });
  test("when count is 1 less than as than number of inputs", () => {
    expect(Yielded.from([1, 2, 3]).dropLast(2).toArray()).toStrictEqual([1]);
  });
  test("when count less than as than number of inputs", () => {
    let lastEmitted: number | undefined;
    const emittedBySkipLast: Array<{ after?: number; value: number }> = [];
    Yielded.from([1, 2, 3, 4, 5])
      .tap((n) => {
        lastEmitted = n;
      })
      .dropLast(2)
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
