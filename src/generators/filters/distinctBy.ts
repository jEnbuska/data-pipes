import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

/**
 * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
 *
 * @example
 * streamless([1,2,3,4].distinctBy(n => n % 2).collect() // [1,2]
 */
export function distinctBy<TInput, Value>(
  source: SyncStreamlessProvider<TInput>,
  selector: (next: TInput) => Value,
): SyncStreamlessProvider<TInput> {
  return function* distinctByGenerator() {
    const set = new Set<Value>();
    using generator = _internalStreamless.disposable(source);
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
  source: AsyncStreamlessProvider<TInput>,
  selector: (next: TInput) => Value,
): AsyncStreamlessProvider<TInput> {
  return async function* distinctByAsyncGenerator() {
    const set = new Set<Value>();
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      const key = selector(next);
      if (set.has(key)) continue;
      set.add(key);
      yield next;
    }
  };
}
