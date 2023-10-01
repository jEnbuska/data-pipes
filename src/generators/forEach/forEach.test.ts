import { describe, test, mock, expect } from "bun:test";
import { chainable, forEach } from "../..";
import { pipe } from "../../pipe/pipe.ts";

describe("forEach", () => {
  test("chainable single value", () => {
    const callback = mock((n: number) => expect(n).toBe(1));
    chainable(1).forEach(callback).consume();
    expect(callback).toHaveBeenCalledTimes(1);
  });
  test("pipe single value", () => {
    const callback = mock((n: number) => expect(n).toBe(1));
    pipe(1, forEach(callback)).consume();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("with multiple", () => {
    let index = 0;
    const args = [1, 2];
    const callback = mock((n: number) => {
      const expected = args[index++];
      expect(n).toBe(expected);
    });
    chainable(args).forEach(callback).consume();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
