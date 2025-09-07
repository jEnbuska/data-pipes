import {
  type GeneratorMiddleware,
  type AsyncGeneratorMiddleware,
} from "../types.ts";

/**
 * takes items produced by the generator while the predicate returns true and yields them to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  takeWhile(n => n < 3)
 * ).toArray() // [1,2]
 */
export function takeWhile<TInput>(
  predicate: (next: TInput) => boolean,
): GeneratorMiddleware<TInput> {
  return function* takeWhileGenerator(generator) {
    for (const next of generator) {
      if (predicate(next)) {
        yield next;
      } else {
        break;
      }
    }
  };
}

export function takeWhileAsync<TInput>(
  predicate: (next: TInput) => boolean,
): AsyncGeneratorMiddleware<TInput> {
  return async function* takeWhileAsyncGenerator(generator) {
    for await (const next of generator) {
      if (predicate(next)) {
        yield next;
      } else {
        break;
      }
    }
  };
}
