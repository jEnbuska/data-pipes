import { describe, test, expect } from "bun:test";
import { chainable, pipe, flat } from "../..";

/* Verify typing after flatmap is expected */
function verify<T>() {
  return (_: T) => {};
}
describe("flat", () => {
  const numbers = [1, 2, 3];
  function flatten<T, const D extends number>(input: T[], depth: D) {
    return (
      chainable(input)
        .forEach(verify<FlatArray<T[], 0>>())
        .flat(depth)
        // Verify typing works correctly
        .forEach(verify<FlatArray<T[], D>>())
        .toArray()
    );
  }
  describe("depth 0", () => {
    const depth = 0;
    test(`singles`, () => {
      const result: number[] = flatten(numbers, depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`1 deep array`, () => {
      const result: number[][] = flatten([numbers], depth);
      expect(result).toStrictEqual([numbers]);
    });
    test(`2 deep array`, () => {
      const result: number[][][] = flatten([[numbers]], depth);
      expect(result).toStrictEqual([[numbers]]);
    });
  });

  describe("depth 1", () => {
    const depth = 1;
    test(`singles`, () => {
      const result: number[] = flatten(numbers, depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`1 deep array`, () => {
      const result: number[] = flatten([numbers], depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`2 deep array`, () => {
      const result: number[][] = flatten([[numbers]], depth);
      expect(result).toStrictEqual([numbers]);
    });
    test(`3 deep array`, () => {
      const result: number[][][] = flatten([[[numbers]]], depth);
      expect(result).toStrictEqual([[numbers]]);
    });
  });

  describe("depth 2", () => {
    const depth = 2;
    test(`singles`, () => {
      const result: number[] = flatten(numbers, depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`1 deep array`, () => {
      const result: number[] = flatten([numbers], depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`2 deep array`, () => {
      const result: number[] = flatten([[numbers]], depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`3 deep array`, () => {
      const result: number[][] = flatten([[[numbers]]], depth);
      expect(result).toStrictEqual([numbers]);
    });
    test(`4 deep array`, () => {
      const result: number[][][] = flatten([[[[numbers]]]], depth);
      expect(result).toStrictEqual([[numbers]]);
    });
  });

  describe("depth 3", () => {
    const depth = 3;
    test(`singles`, () => {
      const result: number[] = flatten(numbers, depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`1 deep array`, () => {
      const result: number[] = flatten([numbers], depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`2 deep array`, () => {
      const result: number[] = flatten([[numbers]], depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`3 deep array`, () => {
      const result: number[] = flatten([[[numbers]]], depth);
      expect(result).toStrictEqual(numbers);
    });
    test(`4 deep array`, () => {
      const result: number[][] = flatten([[[[numbers]]]], depth);
      expect(result).toStrictEqual([numbers]);
    });
    test(`5 deep array`, () => {
      const result: number[][][] = flatten([[[[[numbers]]]]], depth);
      expect(result).toStrictEqual([[numbers]]);
    });
  });

  describe("mixed", () => {
    const input = [1, [2, [3, [4, [5]]]]];
    test("depth 0", () => {
      const result = flatten(input, 0);
      expect(result).toStrictEqual(input);
    });
    test("depth 1", () => {
      const result = flatten(input, 1);
      expect(result).toStrictEqual([1, 2, [3, [4, [5]]]]);
    });
    test("depth 2", () => {
      const result = flatten(input, 2);
      expect(result).toStrictEqual([1, 2, 3, [4, [5]]]);
    });
    test("depth 3", () => {
      const result = flatten(input, 3);
      expect(result).toStrictEqual([1, 2, 3, 4, [5]]);
    });
    test("depth 4", () => {
      const result = flatten(input, 4);
      expect(result).toStrictEqual([1, 2, 3, 4, 5]);
    });
  });

  test("pipe depth 1", () => {
    const array = pipe([[1], [2], [3]], flat()).toArray();
    expect(array).toStrictEqual(array);
  });
  test("pipe mixed depths", () => {
    const result = pipe([[1], [[2]], [[[3]]]], flat(2)).toArray();
    expect(result).toStrictEqual([1, 2, [3]]);
  });
});
