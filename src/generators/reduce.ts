import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

/**
 * Reduces items produced by the generator using the provided reducer function.
 * The final result of the reduction is yielded to the next operation.
 * @example
 * source([1,2,3].reduce((sum, n) => sum + n, 0).first() // 6
 * */
export function reduce<TInput, TOutput>(
  reducer: (acc: TOutput, next: TInput) => TOutput,
  initialValue: TOutput,
): GeneratorMiddleware<TInput, TOutput> {
  return function* reduceGenerator(generator) {
    let acc = initialValue;
    for (const next of generator) {
      acc = reducer(acc, next);
    }
    yield acc;
  };
}

export function reduceAsync<TInput, TOutput>(
  reducer: (acc: TOutput, next: TInput) => TOutput,
  initialValue: TOutput,
): AsyncGeneratorMiddleware<TInput, TOutput> {
  return async function* reduceAsyncGenerator(generator) {
    let acc = initialValue;
    for await (const next of generator) {
      acc = reducer(acc, next);
    }
    yield acc;
  };
}
