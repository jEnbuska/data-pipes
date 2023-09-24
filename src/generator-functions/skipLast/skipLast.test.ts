import { describe, test, expect, mock } from "bun:test";
import pipe from "../../index.ts";

describe("skipLast", () => {
  test("skip last when array is empty", () => {
    expect(pipe().skipLast(3).toArray()).toStrictEqual([]);
  });

  test("when count is more than number of inputs", () => {
    expect(pipe(1, 2).skipLast(3).toArray()).toStrictEqual([]);
  });
  test("when count is same as than number of inputs", () => {
    expect(pipe(1, 2, 3).skipLast(3).toArray()).toStrictEqual([]);
  });
  test("when count is 1 less than as than number of inputs", () => {
    expect(pipe(1, 2, 3).skipLast(2).toArray()).toStrictEqual([1]);
  });
  test("when count less than as than number of inputs", () => {
    let lastEmitted: number | undefined;
    const emittedBySkipLast: Array<{ after?: number; value: number }> = [];
    pipe(1, 2, 3, 4, 5)
      .forEach((n) => {
        lastEmitted = n;
      })
      .skipLast(2)
      .forEach((n) => {
        emittedBySkipLast.push({ after: lastEmitted, value: n });
      })
      .toConsumer();
    expect(emittedBySkipLast).toStrictEqual([
      { after: 3, value: 1 },
      { after: 4, value: 2 },
      { after: 5, value: 3 },
    ]);
  });
});
