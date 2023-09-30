import { describe, test, mock, expect } from "bun:test";
import { chainable } from "../..";

describe("forEach", () => {
  test("single value", () => {
    const callback = mock((n: number) => expect(n).toBe(1));
    chainable.from(1).forEach(callback).toConsumer();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("with multiple", () => {
    let index = 0;
    const args = [1, 2];
    const callback = mock((n: number) => {
      const expected = args[index++];
      expect(n).toBe(expected);
    });
    chainable.from(args).forEach(callback).toConsumer();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
