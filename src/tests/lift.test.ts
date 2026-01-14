import { describe, test, expect } from "vitest";
import yielded from "../index.ts";

describe("lift", () => {
  test("lift mapper", () => {
    const array = yielded([1, 2, 3])
      .lift(function* multiplyByTwo(generator) {
        for (const next of generator) {
          yield next * 2;
        }
      })
      .resolve();
    expect(array).toStrictEqual([2, 4, 6]);
  });

  test("lift single", () => {
    const array = yielded(1)
      .lift(function* multiplyByTwo(generator) {
        for (const next of generator) {
          yield next * 2;
        }
      })
      .resolve() satisfies number[];
    expect(array).toStrictEqual([2]);
  });
  test("lift filter", () => {
    const array = yielded([-2, 1, 2, -3, 4])
      .lift(function* filterNegatives(generator) {
        for (const next of generator) {
          if (next < 0) continue;
          yield next;
        }
      })
      .resolve();
    expect(array).toStrictEqual([1, 2, 4]);
  });

  test("lift aggregate", () => {
    const text = yielded(function* () {
      yield* ["a", "b", "c"];
    })
      .lift(function* joinStrings(generator) {
        const acc: string[] = [];
        for (const next of generator) {
          acc.push(next);
        }
        yield acc.join(".");
      })
      .resolve(new AbortController().signal) satisfies string[];
    expect(text).toStrictEqual(["a.b.c"]);
  });

  test("lift async", async () => {
    const text = (await yielded(async function* () {
      yield "a";
      yield "b";
      yield "c";
    })
      .lift(async function* joinStrings(generator) {
        const acc: string[] = [];
        for await (const next of generator) {
          acc.push(next);
        }
        yield acc.join(".");
      })
      .resolve(new AbortController().signal)) satisfies string[];
    expect(text).toStrictEqual(["a.b.c"]);
  });
});
