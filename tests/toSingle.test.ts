import { expect, test, describe } from "bun:test";
import { toSingle } from "../src/consumers/toSingle.ts";
import pipe from "../src/pipe.ts";

describe("toSingle", () => {
  test("iterable to single", () => {
    expect(
      toSingle(function* source() {
        yield 1;
      }),
    ).toBe(1);
  });

  test("none to single", () => {
    expect(() => toSingle(function* source() {})).toThrow(
      "No items in generator",
    );
  });
  test("delegated iterable to single", () => {
    expect(
      toSingle(function* source() {
        yield* [1, 2, 3];
      }),
    ).toBe(1);
  });
  test("expect generator next to be called only once", () => {
    let last = 0;
    const generator = function* source() {
      yield (last = 1);
      yield (last = 2);
    };
    expect(last).toBe(0);
    toSingle(generator);
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
