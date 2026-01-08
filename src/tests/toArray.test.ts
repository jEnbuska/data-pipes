import { expect, test, describe } from "bun:test";
import { createTestSets } from "./utils/createTestSets.ts";

describe("toArray", () => {
  const numbers = [1, 2, 3];
  test("array test set", async () => {
    const {
      fromResolvedPromises,
      fromSingle,
      fromAsyncGenerator,
      fromGenerator,
      fromPromises,
      fromArray,
      fromEmpty,
      fromEmptyAsync,
    } = createTestSets(numbers);
    expect(fromSingle.toArray() satisfies number[]).toEqual(
      numbers.slice(0, 1),
    );
    expect(
      await (fromResolvedPromises.toArray() satisfies Promise<number[]>),
    ).toStrictEqual(numbers);
    expect(
      await (fromAsyncGenerator.toArray() satisfies Promise<number[]>),
    ).toStrictEqual(numbers);
    expect(
      await Promise.all(
        fromPromises.toArray() satisfies Array<Promise<number>>,
      ),
    ).toStrictEqual(numbers);
    expect(fromGenerator.toArray() satisfies number[]).toStrictEqual(numbers);
    expect(fromArray.toArray()).toStrictEqual(numbers);
    expect(fromEmpty.toArray() satisfies number[]).toStrictEqual([]);
    expect(
      await (fromEmptyAsync.toArray() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
