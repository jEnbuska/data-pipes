import { describe, expect, test } from "vitest";
import { Yielded } from "../../src/index.ts";
import { createTestSets } from "../utils/createTestSets.ts";

describe("every", () => {
  test("has every", () => {
    expect(Yielded.from([true, true, true]).every(Boolean)).toBe(true);
  });
  test("has none", () => {
    expect(Yielded.from([false, false, false]).every(Boolean)).toBe(false);
  });

  test("has some", () => {
    expect(Yielded.from([false, false, false]).every(Boolean)).toBe(false);
  });

  const numbers = [1, 2, 3, 4];
  const {
    fromResolvedPromises,

    fromPromises,
    fromArray,
    empty,
  } = createTestSets(numbers);
  function isGreaterThenZero(value: number) {
    return value > 0;
  }

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.every(
        isGreaterThenZero,
      ) satisfies Promise<boolean>),
    ).toStrictEqual(true);
  });

  test("from promises", async () => {
    expect(
      (await fromPromises.awaited().every(isGreaterThenZero)) satisfies boolean,
    ).toStrictEqual(true);
  });

  test("from array", () => {
    expect(fromArray.every(isGreaterThenZero) satisfies boolean).toStrictEqual(
      true,
    );
  });

  function isGreaterThan100(value: number) {
    return value > 100;
  }
  test("from empty", () => {
    expect(empty.every(isGreaterThan100) satisfies boolean).toStrictEqual(true);
  });
});
