import {
  type GeneratorMiddleware,
  type AsyncGeneratorMiddleware,
} from "../../types";

/**
 * skips items produced by the generator while the predicate returns true and yields the rest to the next operation.
 * @example
 * pipe(
 *  [1,2,3,4],
 *  skipWhile(n => n < 3)
 * ).toArray() // [3,4]
 * */
export function skipWhile<TInput>(
  predicate: (next: TInput) => boolean,
): GeneratorMiddleware<TInput> {
  return function* skipWhileGenerator(generator) {
    let skip = true;
    for (const next of generator) {
      if (skip && predicate(next)) {
        continue;
      }
      skip = false;
      yield next;
    }
  };
}
export function skipWhileAsync<TInput>(
  predicate: (next: TInput) => boolean,
): AsyncGeneratorMiddleware<TInput> {
  return async function* skipWhileAsyncGenerator(generator) {
    let skip = true;
    for await (const next of generator) {
      if (skip && predicate(next)) {
        continue;
      }
      skip = false;
      yield next;
    }
  };
}
