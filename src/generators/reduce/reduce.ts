import { type GeneratorMiddleware } from "../../types";

/**
 * Reduces items produced by the generator using the provided reducer function.
 * The final result of the reduction is yielded to the next operation.
 * @example
 * pipe(
 *   [1,2,3],
 *   reduce((sum, n) => sum + n, 0)
 * ).first() // 6
 * */
export function reduce<Input, Output>(
  reducer: (acc: Output, next: Input) => Output,
  initialValue: Output,
): GeneratorMiddleware<Input, Output> {
  return function* reduceGenerator(generator) {
    let acc = initialValue;
    for (const next of generator) {
      acc = reducer(acc, next);
    }
    yield acc;
  };
}
