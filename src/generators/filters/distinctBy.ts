import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

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
  return function* distinctByGenerator() {
    const set = new Set<Value>();
    using generator = disposable(source);
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
  source: AsyncPipeSource<TInput>,
  selector: (next: TInput) => Value,
): AsyncPipeSource<TInput> {
  return async function* distinctByAsyncGenerator() {
    const set = new Set<Value>();
    using generator = disposable(source);
    for await (const next of generator) {
      const key = selector(next);
      if (set.has(key)) continue;
      set.add(key);
      yield next;
    }
  };
}
