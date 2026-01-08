import { describe, test, expect } from "bun:test";
import { streamless } from "../";
import { disposable } from "../utils.ts";

describe("lift", () => {
  test("lift mapper", () => {
    const array = streamless([1, 2, 3])
      .lift(function multiplyByTwo(source) {
        return function* () {
          using generator = disposable(source);
          for (const next of generator) {
            yield next * 2;
          }
        };
      })
      .toArray();
    expect(array).toStrictEqual([2, 4, 6]);
  });

  test("lift filter", () => {
    const array = streamless([-2, 1, 2, -3, 4])
      .lift(function filterNegatives(source) {
        return function* () {
          using generator = disposable(source);
          for (const next of generator) {
            if (next < 0) continue;
            yield next;
          }
        };
      })
      .toArray();
    expect(array).toStrictEqual([1, 2, 4]);
  });

  test("lift aggregate", () => {
    const text = streamless(["a", "b", "c"])
      .lift(function joinStrings(source) {
        return function* () {
          const acc: string[] = [];
          using generator = disposable(source);
          for (const next of generator) {
            acc.push(next);
          }
          yield acc.join(".");
        };
      })
      .first();
    expect(text).toStrictEqual("a.b.c");
  });
});
