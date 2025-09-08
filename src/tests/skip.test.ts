import { describe, test, expect } from "bun:test";
import { chain, skip } from "../index.ts";
import { pipe } from "../pipe.ts";

describe("skip", () => {
  test("chainable skip 1", () => {
    expect(chain([1, 2, 3]).skip(1).toArray()).toStrictEqual([2, 3]);
  });

  test("pipe skip 1", () => {
    expect(pipe([1, 2, 3], skip(1)).toArray()).toStrictEqual([2, 3]);
  });

  test("skip all", () => {
    expect(chain([1, 2, 3]).skip(5).toArray()).toStrictEqual([]);
  });

  test("skip none", () => {
    expect(chain([1, 2, 3]).skip(0).toArray()).toStrictEqual([1, 2, 3]);
  });

  test("skip negative", () => {
    expect(chain([1, 2, 3]).skip(-1).toArray()).toStrictEqual([1, 2, 3]);
  });
});
