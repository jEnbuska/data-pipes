import { type GeneratorMiddleware } from "../../types";

/**
 * Maps next item produced by the generator using the provided transform function and yields it
 * to the next operation.
 *
 * @example
 * pipe(
 *   [1,2,3],
 *   map(n => n * 2)
 * ).toArray() // [2, 4, 6];
 */
export function map<Input, Output>(
  mapper: (next: Input) => Output,
): GeneratorMiddleware<Input, Output> {
  return function* mapGenerator(generator) {
    for (const next of generator) {
      yield mapper(next);
    }
  };
}
