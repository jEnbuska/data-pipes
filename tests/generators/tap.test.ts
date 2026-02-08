import { describe, expect, test } from "vitest";
import { Yielded } from "../../src/index.ts";
import { createTestSets } from "../utils/createTestSets.ts";
import { simpleMock } from "../utils/simpleMock.ts";

describe("tap", () => {
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

    fromPromises,
    fromArray,
    empty,
  } = createTestSets(numbers);

  test("from resolved promises", async () => {
    const args = [1, 2];
    const callback = simpleMock(args);

    await (fromResolvedPromises
      .tap(callback)
      .consume() satisfies Promise<void>);
    expect(callback.getCalled()).toBe(2);
  });

  test("from promises", async () => {
    const callback = simpleMock(numbers);
    (await fromPromises.awaited().tap(callback).consume()) satisfies void;
    expect(callback.getCalled()).toBe(2);
  });

  describe("from array", () => {
    createTestSets(numbers).modes.forEach(({ mode, yielded }) => {
      test(mode, async () => {
        const callback = simpleMock(numbers);
        (await yielded.tap(callback).consume()) satisfies void;
        expect(callback.getCalled()).toBe(2);
      });
    });
  });

  test("from array", () => {
    const callback = simpleMock(numbers);
    fromArray.tap(callback).consume() satisfies void;
    expect(callback.getCalled()).toBe(2);
  });

  test("from empty", () => {
    const callback = simpleMock(numbers);
    empty.tap(callback).consume() satisfies void;
    expect(callback.getCalled()).toBe(0);
  });
});
