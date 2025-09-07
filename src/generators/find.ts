import {
  type GeneratorMiddleware,
  type AsyncGeneratorMiddleware,
} from "../types.ts";

/**
 * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
 * @example
 * pipe(
 *  [1,2,3,4],
 *  find(n => n > 2)
 * ).toArray() // [3]
 */
export function find<TInput>(
  predicate: (next: TInput) => boolean,
): GeneratorMiddleware<TInput> {
  return function* findGenerator(generator) {
    for (const next of generator) {
      if (predicate(next)) {
        yield next;
        break;
      }
    }
  };
}

export function findAsync<TInput>(
  predicate: (next: TInput) => boolean,
): AsyncGeneratorMiddleware<TInput> {
  return async function* findAsyncGenerator(generator) {
    for await (const next of generator) {
      if (predicate(next)) {
        yield next;
        break;
      }
    }
  };
}
