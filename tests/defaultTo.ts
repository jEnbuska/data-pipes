import { describe, expect, test } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";

describe("defaultTo", () => {
  const numbers = [1, 2, 3];
  const { fromSingle, fromSingleAsync } = createTestSets(numbers);
  test("from single", () => {
    expect(fromSingle.defaultTo(() => 0).toArray() satisfies number).toEqual(
      numbers[0],
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromSingleAsync
        .defaultTo(() => 0)
        .toArray() satisfies Promise<number>),
    ).toStrictEqual(0);
  });
});
