import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function distinctBySync<TInput, Value>(
  source: SyncStreamlessProvider<TInput>,
  selector: (next: TInput) => Value,
): SyncStreamlessProvider<TInput> {
  return function* distinctBySyncGenerator() {
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
): AsyncStreamlessProvider<Awaited<TInput>> {
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
