import { describe, test, expect } from "bun:test";
import { chain } from "../index.ts";

describe("take", () => {
  test("take 1", () => {
    expect(chain([1, 2, 3]).take(1).toArray()).toStrictEqual([1]);
  });
  test("take 2", () => {
    expect(chain([1, 2, 3]).take(2).toArray()).toStrictEqual([1, 2]);
  });

  test("take 2 async", async () => {
    expect(await chain([1, 2, 3]).resolve().take(2).toArray()).toStrictEqual([
      1, 2,
    ]);
  });

  test("take none", () => {
    expect(chain([1, 2, 3]).take(0).toArray()).toStrictEqual([]);
  });

  test("take negative", () => {
    expect(chain([1, 2, 3]).take(-1).toArray()).toStrictEqual([]);
  });
});
