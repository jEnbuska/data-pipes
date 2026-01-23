import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function distinctBySync<TInput, TSelect>(
  selector: (next: TInput) => TSelect,
): YieldedSyncMiddleware<TInput> {
  return function* distinctBySyncGenerator(generator) {
    const set = new Set<TSelect>();
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
export function distinctByAsync<TInput, TSelect>(
  selector: (next: TInput) => Promise<TSelect> | TSelect,
): YieldedAsyncMiddleware<TInput> {
  return async function* distinctByAsyncResolver(generator) {
    const set = new Set<TSelect>();
    for await (const next of generator) {
      const key = await selector(next);
      if (set.has(key)) continue;
      set.add(key);
      yield next;
    }
  };
}
