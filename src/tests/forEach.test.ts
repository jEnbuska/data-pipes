import { describe, test, mock, expect } from "bun:test";
import { chain, forEach } from "../index.ts";
import { pipe } from "../pipe/pipe.ts";
import { createTestSets } from "./utils/createTestSets.ts";

describe("forEach", () => {
  test("chainable single value", () => {
    const callback = mock((n: number) => expect(n).toBe(1));
    chain(1).forEach(callback).consume();
    expect(callback).toHaveBeenCalledTimes(1);
  });
  test("pipe single value", () => {
    const callback = mock((n: number) => expect(n).toBe(1));
    pipe(1, forEach(callback)).consume();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  const createCallback = (args: number[]) => {
    let index = 0;
    return mock((n: number) => {
      const expected = args[index++];
      expect(n).toBe(expected);
    });
  };
  test("with multiple", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    chain(args).forEach(callback).consume();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  const numbers = [1, 2];
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
  test("from single", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromSingle.forEach(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("from resolver promises", async () => {
    const args = [1, 2];
    const callback = createCallback(args);

    await (fromResolvedPromises
      .forEach(callback)
      .consume() satisfies Promise<void>);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from async generator", async () => {
    const args = [1, 2];
    const callback = createCallback(args);

    await (fromAsyncGenerator
      .forEach(callback)
      .consume() satisfies Promise<void>);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from promises", async () => {
    const args = [1, 2];
    const callback = createCallback(args);

    // TODO fix this
    (await fromPromises
      .resolve()
      .forEach(callback)
      .consume()) satisfies void | Promise<void>;

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from generator", async () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromGenerator.forEach(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from array", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromArray.forEach(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("from empty", () => {
    const args = [1, 2];
    const callback = createCallback(args);
    fromEmpty.forEach(callback).consume() satisfies void;
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test("from empty async", async () => {
    const args = [1, 2];
    const callback = createCallback(args);
    await (fromEmptyAsync.forEach(callback).consume() satisfies Promise<void>);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
