import { describe, expect, test } from "vitest";
import { Yielded } from "../../src";
import { createTestSets } from "../utils/createTestSets.ts";
import { delay } from "../utils/delay.ts";

describe("maxBy", () => {
  const numbers = [2, 1, 3, 5, 4];
  const {
    fromResolvedPromises,

    fromPromises,
    fromArray,
    empty,
  } = createTestSets(numbers);
  const modulo4 = (n: number) => n % 4;

  test("from resolved promises", async () => {
    expect(
      await (fromResolvedPromises.maxBy(modulo4) satisfies Promise<
        number | void
      >),
    ).toStrictEqual(3);
  });

  test("from promises", async () => {
    const first = fromPromises.awaited().maxBy(modulo4) satisfies Promise<
      number | void
    >;
    expect(await first).toStrictEqual(3);
  });

  test("from array", () => {
    expect(fromArray.maxBy(modulo4) satisfies number | void).toStrictEqual(3);
  });

  test("from empty", () => {
    expect(empty.maxBy(modulo4) satisfies number | void).toStrictEqual(
      undefined,
    );
  });

  test("Parallel", async () => {
    expect(
      await (Yielded.from([5, 1, 300, 3])
        .parallel(2)
        .map((it) => delay(it, it))
        .maxBy((it) => it) satisfies Promise<number | void>),
    ).toStrictEqual(300);
  });
});
