import { describe, test, expect } from "bun:test";

import { createTestSets } from "./utils/createTestSets";

describe("defaultTo", () => {
  const numbers = [1, 2, 3];
  const { fromSingle, fromSingleAsync } = createTestSets(numbers);
  test("from single", () => {
    expect(fromSingle.defaultTo(() => 0).collect() satisfies number).toEqual(
      numbers[0],
    );
  });

  test("from empty async", async () => {
    expect(
      await (fromSingleAsync
        .defaultTo(() => 0)
        .collect() satisfies Promise<number>),
    ).toStrictEqual(0);
  });
});
