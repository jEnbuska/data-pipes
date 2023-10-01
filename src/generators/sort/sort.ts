import { type GeneratorMiddleware } from "../../types";

/**
 * sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
 *
 * @example
 * pipe(
 *  [3,2,1],
 *  sort((a, z) => a - z)
 * ).toArray() // [1,2,3]
 */
export function sort<Input = never>(
  comparator?: (a: Input, b: Input) => number,
): GeneratorMiddleware<Input> {
  return function* sortGenerator(generator) {
    yield* [...generator].sort(comparator);
  };
}
