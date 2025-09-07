import {
  type GeneratorMiddleware,
  type AsyncGeneratorMiddleware,
} from "../../types";

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
export function map<TInput, TOutput>(
  mapper: (next: TInput) => TOutput,
): GeneratorMiddleware<TInput, TOutput> {
  return function* mapGenerator(generator) {
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  mapper: (next: TInput) => TOutput,
): AsyncGeneratorMiddleware<TInput, TOutput> {
  return async function* mapAsyncGenerator(generator) {
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
