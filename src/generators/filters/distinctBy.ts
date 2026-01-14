import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function distinctBySync<TInput, Value>(
  source: SyncYieldedProvider<TInput>,
  selector: (next: TInput) => Value,
): SyncYieldedProvider<TInput> {
  return function* distinctBySyncGenerator() {
    const set = new Set<Value>();
    using generator = _internalYielded.disposable(source);
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
  source: AsyncYieldedProvider<TInput>,
  selector: (next: TInput) => Value,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* distinctByAsyncGenerator() {
    const set = new Set<Value>();
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      const key = selector(next);
      if (set.has(key)) continue;
      set.add(key);
      yield next;
    }
  };
}
