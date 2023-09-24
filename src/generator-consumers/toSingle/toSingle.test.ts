import { expect, test, describe } from "bun:test";
import { toSingle } from "./toSingle.ts";
import pipe from "../../index.ts";
import { type OperatorGenerator } from "../../types.ts";

describe("toSingle", () => {
  test("iterable to single", () => {
    function* source() {
      yield 1;
    }
    expect(toSingle(source())).toBe(1);
  });

  test("none to single", () => {
    function* source() {}
    expect(() => toSingle(source())).toThrow("No items in generator");
  });

  test("none to single defaultValue", () => {
    function* source(): OperatorGenerator<number> {}
    const value: string | number = toSingle(source(), "default");
    expect(value).toBe("default");
  });
  test("delegated iterable to single", () => {
    function* source() {
      yield* [1, 2, 3];
    }
    expect(toSingle(source())).toBe(1);
  });
  test("expect generator next to be called only once", () => {
    let last = 0;
    function* source() {
      yield (last = 1);
      yield (last = 2);
    }
    expect(last).toBe(0);
    toSingle(source());
    expect(last).toBe(1);
  });

  test("pipe to single", () => {
    expect(pipe(1, 2).toSingle()).toBe(1);
  });

  test("pipe none single", () => {
    expect(() => pipe([]).toSingle()).toThrow("No items in generator");
  });

  test("pipe none with default to single", () => {
    expect(pipe([]).defaultIfEmpty("None").toSingle()).toBe("None");
  });
});
