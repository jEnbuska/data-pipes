import { expect, test, describe } from "bun:test";
import { createTestSets } from "./utils/createTestSets";

describe("array collect tests", () => {
  const numbers = [1, 2, 3];
  test("array test set", async () => {
    const {
      fromResolvedPromises,
      fromAsyncGenerator,
      fromGenerator,
      fromPromises,
      fromArray,
      fromEmpty,
      fromEmptyAsync,
    } = createTestSets(numbers);
    expect(
      await (fromResolvedPromises.collect() satisfies Promise<number[]>),
    ).toStrictEqual(numbers);
    expect(
      (await fromAsyncGenerator.collect()) satisfies number[],
    ).toStrictEqual(numbers);
    expect(
      await Promise.all(
        fromPromises.collect() satisfies Array<Promise<number>>,
      ),
    ).toStrictEqual(numbers);
    expect(fromGenerator.collect() satisfies number[]).toStrictEqual(numbers);
    expect(fromArray.collect() satisfies number[]).toStrictEqual(numbers);
    expect(fromEmpty.collect() satisfies number[]).toStrictEqual([]);
    expect(
      await (fromEmptyAsync.collect() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
