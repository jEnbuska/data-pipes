import { describe, expect, test } from "vitest";
import { AsyncYielded, Yielded } from "../src/index.ts";

describe("drop", () => {
  test("chainable drop 1", () => {
    expect(Yielded.from([1, 2, 3]).drop(1).toArray()).toStrictEqual([2, 3]);
  });

  test("drop all", () => {
    expect(Yielded.from([1, 2, 3]).drop(5).toArray()).toStrictEqual([]);
  });

  test("drop none", () => {
    expect(Yielded.from([1, 2, 3]).drop(0).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("drop negative", () => {
    expect(() => Yielded.from([1, 2, 3]).drop(-1).toArray()).toThrow(
      RangeError,
    );
  });

  test("drop negative async", () => {
    expect(() =>
      AsyncYielded.from(Promise.resolve([1, 2, 3]))
        .drop(-1)
        .toArray(),
    ).toThrow(RangeError);
  });
});
