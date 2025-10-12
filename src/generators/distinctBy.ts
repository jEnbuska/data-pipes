import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

/**
 * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
 *
 * @example
 * source([1,2,3,4].distinctBy(n => n % 2).toArray() // [1,2]
 */
export function distinctBy<TInput, Value>(
  selector: (next: TInput) => Value,
): GeneratorMiddleware<TInput> {
  return function* distinctByGenerator(generator) {
    const set = new Set<Value>();
    for (const next of generator) {
      const key = selector(next);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield next;
    }
  };
}
export function distinctByAsync<TInput, Value>(
  selector: (next: TInput) => Value,
): AsyncGeneratorMiddleware<TInput> {
  return async function* distinctByAsyncGenerator(generator) {
    const set = new Set<Value>();
    for await (const next of generator) {
      const key = selector(next);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield next;
    }
  };
}
