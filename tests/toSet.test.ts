import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";

describe("toSet", () => {
  test("Set of numbers", () => {
    const set = Yielded.from([3, 1, 2]).toSet() satisfies Set<number>;
    expect(set.has(1)).toBe(true);
    expect(set.has(2)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.size).toBe(3);
  });

  test("empty set", () => {
    const set = Yielded.from([]).toSet() satisfies Set<never>;
    expect(set.size).toBe(0);
  });

  test("empty async", async () => {
    const setPromise = Yielded.from([1, 2, 3])
      .awaited()
      .toSet() satisfies Promise<Set<number>>;
    const set = await setPromise;
    expect(set.has(1)).toBe(true);
    expect(set.has(2)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.size).toBe(3);
  });
});
