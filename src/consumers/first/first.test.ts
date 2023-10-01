import { expect, test, describe } from "bun:test";
import { first } from "./first.ts";
import { chainable } from "../..";
import { type GeneratorProvider } from "../../types";

describe("first", () => {
  test("iterable to first", () => {
    function* source() {
      yield 1;
    }
    expect(first()(source())).toBe(1);
  });

  test("none to first", () => {
    function* source() {}
    expect(() => first()(source())).toThrow("No items in generator");
  });

  test("none to first defaultValue", () => {
    function* source(): GeneratorProvider<number> {}
    const value: string | number = first("default")(source());
    expect(value).toBe("default");
  });
  test("delegated iterable to first", () => {
    function* source() {
      yield* [1, 2, 3];
    }
    expect(first()(source())).toBe(1);
  });
  test("expect generator next to be called only once", () => {
    let last = 0;
    function* source() {
      yield (last = 1);
      yield (last = 2);
    }
    expect(last).toBe(0);
    first()(source());
    expect(last).toBe(1);
  });

  test("pipe to first", () => {
    expect(chainable(1, 2).first()).toBe(1);
  });

  test("pipe none first", () => {
    expect(() => chainable([]).first()).toThrow("No items in generator");
  });

  test("pipe none with default to first", () => {
    expect(chainable([]).defaultIfEmpty("None").first()).toBe("None");
  });
});
