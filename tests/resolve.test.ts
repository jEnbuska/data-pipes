import { expect, test, describe } from "vitest";
import { createTestSets } from "./utils/createTestSets.ts";
import yielded from "../src/index.ts";

describe("array resolve tests", () => {
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
      await (fromResolvedPromises.resolve() satisfies Promise<number[]>),
    ).toStrictEqual(numbers);
    expect(
      (await fromAsyncGenerator.resolve()) satisfies number[],
    ).toStrictEqual(numbers);
    expect(
      await Promise.all(
        fromPromises.resolve() satisfies Array<Promise<number>>,
      ),
    ).toStrictEqual(numbers);
    expect(fromGenerator.resolve() satisfies number[]).toStrictEqual(numbers);
    expect(fromArray.resolve() satisfies number[]).toStrictEqual(numbers);
    expect(fromEmpty.resolve() satisfies number[]).toStrictEqual([]);
    expect(
      await (fromEmptyAsync.resolve() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });

  test("chainable to consume", async () => {
    const result = (await yielded(async function* () {
      yield* await Promise.resolve(numbers);
    }).resolve()) satisfies number[];
    expect(result).toStrictEqual(numbers);
  });
});
