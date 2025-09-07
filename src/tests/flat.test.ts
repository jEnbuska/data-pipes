import { describe, test, expect } from "bun:test";
import { chain, pipe, flat } from "../index.ts";
import { createTestSets } from "./utils/createTestSets.ts";

/* Verify typing after flatmap is expected */
function verify<T>() {
  return (_: T) => {};
}
describe("flat", () => {
  {
    const numbers = [1, 2, 3];
    function flatten<T, const D extends number>(input: T[], depth: D) {
      return (
        chain(input)
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
        const result = flatten(input, 0) satisfies Array<
          number | Array<number | Array<number | Array<number | number[]>>>
        >;
        expect(result).toStrictEqual(input);
      });
      test("depth 1", () => {
        const result = flatten(input, 1) satisfies Array<
          number | Array<number | Array<number | number[]>>
        >;
        expect(result).toStrictEqual([1, 2, [3, [4, [5]]]]);
      });
      test("depth 2", () => {
        const result = flatten(input, 2) satisfies Array<
          number | Array<number | number[]>
        >;
        expect(result).toStrictEqual([1, 2, 3, [4, [5]]]);
      });
      test("depth 3", () => {
        const result = flatten(input, 3) satisfies Array<number | number[]>;
        expect(result).toStrictEqual([1, 2, 3, 4, [5]]);
      });
      test("depth 4", () => {
        const result = flatten(input, 4) satisfies number[];
        expect(result).toStrictEqual([1, 2, 3, 4, 5]);
      });
    });

    test("pipe depth 1", () => {
      const array = pipe([[1], [2], [3]], flat()).toArray() satisfies number[];
      expect(array).toStrictEqual(array);
    });
    test("pipe mixed depths", () => {
      const result = pipe(
        [[1], [[2]], [[[3]]]],
        flat(2),
      ).toArray() satisfies Array<number | number[]>;
      expect(result).toStrictEqual([1, 2, [3]]);
    });
  }
  const numbers = [[[1, 2]], [], [3, [4, 5]]];
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
    expect(fromSingle.flat(5).toArray() satisfies number[]).toEqual([1, 2]);
  });

  test("from resolver promises", async () => {
    expect(
      await (fromResolvedPromises.flat(5).toArray() satisfies Promise<
        number[]
      >),
    ).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("from async generator", async () => {
    expect(
      await (fromAsyncGenerator.flat(5).toArray() satisfies Promise<number[]>),
    ).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("from promises", async () => {
    expect(
      // TODO fix this
      (await fromPromises.resolve().flat(5).toArray()) satisfies
        | number[]
        | Promise<number[]>,
    ).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("from generator", async () => {
    expect(fromGenerator.flat(5).toArray() satisfies number[]).toStrictEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  test("from array", () => {
    expect(fromArray.flat(5).toArray() satisfies number[]).toStrictEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  test("from empty", () => {
    expect(fromEmpty.flat(5).toArray() satisfies number[]).toStrictEqual([]);
  });

  test("from empty async", async () => {
    expect(
      await (fromEmptyAsync.flat(5).toArray() satisfies Promise<number[]>),
    ).toStrictEqual([]);
  });
});
