import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("reverse", () => {
  test("numbers", () => {
    const array = Yielded.from([1, 2, 3]).reversed().toArray();
    expect(array).toStrictEqual([3, 2, 1]);
  });

  test("string async", async () => {
    const array = Yielded.from(["a", "b", "c"])
      .awaited()
      .reversed()
      .toArray() satisfies Promise<string[]>;
    expect(await array).toStrictEqual(["c", "b", "a"]);
  });
});
