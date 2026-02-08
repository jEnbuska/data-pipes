import { describe, expect, test } from "vitest";
import { createTestSets } from "../utils/createTestSets.ts";

describe("minBy", () => {
  const numbers = [2, 1, 3, 5, 4];
  const {
    fromResolvedPromises,

    fromPromises,
    fromArray,
    empty,
    modes,
  } = createTestSets(numbers);
  const modulo4 = (n: number) => n % 4;

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.minBy(modulo4) satisfies Promise<
        number | void
      >),
    ).toBe(4);
  });

  test("from promises", async () => {
    const first = fromPromises.awaited().minBy(modulo4) satisfies Promise<
      number | void
    >;
    expect(await first).toBe(4);
  });

  test("from array", () => {
    expect(fromArray.minBy(modulo4) satisfies number | void).toBe(4);
  });

  test("from empty", () => {
    expect(empty.minBy(modulo4) satisfies number | void).toBe(undefined);
  });

  modes.forEach(({ mode, yielded }) => {
    test(mode, async () => {
      const min = (await yielded.minBy(modulo4)) satisfies number | undefined;
      expect(min).toBe(4);
    });
  });
});
