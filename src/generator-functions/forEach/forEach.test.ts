import { describe, test, mock, expect } from "bun:test";
import pipe from "../..";

describe("forEach", () => {
  test("single value", () => {
    const callback = mock((n: number) => expect(n).toBe(1));
    pipe(1).forEach(callback).toConsumer();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("with multiple", () => {
    let index = 0;
    const args = [1, 2];
    const callback = mock((n: number) => {
      const expected = args[index++];
      expect(n).toBe(expected);
    });
    pipe(args).forEach(callback).toConsumer();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
