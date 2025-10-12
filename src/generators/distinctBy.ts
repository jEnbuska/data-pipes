import { type PipeSource, type AsyncPipeSource } from "../types.ts";

/**
 * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
 *
 * @example
 * source([1,2,3,4].distinctBy(n => n % 2).toArray() // [1,2]
 */
export function distinctBy<TInput, Value>(
  source: PipeSource<TInput>,
  selector: (next: TInput) => Value,
): PipeSource<TInput> {
  return function* distinctByGenerator(signal) {
    const set = new Set<Value>();
    for (const next of source(signal)) {
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
  source: AsyncPipeSource<TInput>,
  selector: (next: TInput) => Value,
): AsyncPipeSource<TInput> {
  return async function* distinctByAsyncGenerator(signal) {
    const set = new Set<Value>();
    for await (const next of source(signal)) {
      const key = selector(next);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield next;
    }
  };
}
