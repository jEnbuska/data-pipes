import { describe, expect, test } from "vitest";
import { Yielded } from "../src/index.ts";
import { createTestSets } from "./utils/createTestSets.ts";
import { simpleMock } from "./utils/simpleMock.ts";

describe("tap", () => {
  test("chainable single value", () => {
    let called = 0;
    const callback = (n: number) => {
      called++;
      expect(n).toBe(1);
    };
    Yielded.from(1).tap(callback).consume();
    expect(called).toBe(1);
  });

  test("with multiple", () => {
    const args = [1, 2];
    let called = 0;
    const callback = () => called++;

    Yielded.from(args).tap(callback).consume();
    expect(called).toBe(2);
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
    const callback = simpleMock(numbers);
    fromSingle.tap(callback).consume() satisfies void;
    expect(callback.getCalled()).toBe(1);
  });

  test("from resolved promises", async () => {
    const args = [1, 2];
    const callback = simpleMock(args);

    await (fromResolvedPromises
      .tap(callback)
      .consume() satisfies Promise<void>);

    expect(callback.getCalled()).toBe(2);
  });

  test("from async generator", async () => {
    const callback = simpleMock(numbers);

    await (fromAsyncGenerator.tap(callback).consume() satisfies Promise<void>);
    expect(callback.getCalled()).toBe(2);
  });

  test("from promises", async () => {
    const callback = simpleMock(numbers);
    (await fromPromises.awaited().tap(callback).consume()) satisfies void;
    expect(callback.getCalled()).toBe(2);
  });

  test("from generator", async () => {
    const callback = simpleMock(numbers);
    fromGenerator.tap(callback).consume() satisfies void;
    expect(callback.getCalled()).toBe(2);
  });

  test("from array", () => {
    const callback = simpleMock(numbers);
    fromArray.tap(callback).consume() satisfies void;
    expect(callback.getCalled()).toBe(2);
  });

  test("from empty", () => {
    const callback = simpleMock(numbers);
    fromEmpty.tap(callback).consume() satisfies void;
    expect(callback.getCalled()).toBe(0);
  });

  test("from empty async", async () => {
    const callback = simpleMock(numbers);
    await (fromEmptyAsync.tap(callback).consume() satisfies Promise<void>);
    expect(callback.getCalled()).toBe(0);
  });
});
