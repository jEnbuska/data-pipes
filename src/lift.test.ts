import { describe, test, expect } from "bun:test";
import { chainable } from ".";

describe("lift", () => {
  test("lift mapper", () => {
    const array = chainable
      .from(1, 2, 3)
      .lift(function* multiplyByTwo(generator) {
        for (const next of generator) {
          yield next * 2;
        }
      })
      .toArray();
    expect(array).toStrictEqual([2, 4, 6]);
  });

  test("lift filter", () => {
    const array = chainable
      .from(-2, 1, 2, -3, 4)
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
    const text = chainable
      .from("a", "b", "c")
      .lift(function* joinStrings(generator) {
        const acc: string[] = [];
        for (const next of generator) {
          acc.push(next);
        }
        yield acc.join(".");
      })
      .toSingle();
    expect(text).toStrictEqual("a.b.c");
  });
});
