import { describe, test, expect } from "bun:test";
import source from "../index.ts";

describe("lift", () => {
  test("lift mapper", () => {
    const array = source([1, 2, 3])
      .lift(function* multiplyByTwo(generator) {
        for (const next of generator) {
          yield next * 2;
        }
      })
      .toArray();
    expect(array).toStrictEqual([2, 4, 6]);
  });

  test("lift filter", () => {
    const array = source([-2, 1, 2, -3, 4])
      .lift(function* filterNegatives(generator) {
        for (const next of generator) {
          if (next < 0) continue;
          yield next;
        }
      })
      .toArray();
    expect(array).toStrictEqual([1, 2, 4]);
  });

  test("lift aggregate", () => {
    const text = source(["a", "b", "c"])
      .lift(function* joinStrings(generator) {
        const acc: string[] = [];
        for (const next of generator) {
          acc.push(next);
        }
        yield acc.join(".");
      })
      .first();
    expect(text).toStrictEqual("a.b.c");
  });
});
