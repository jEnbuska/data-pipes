import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* distinctBySync<T, TSelect>(
  generator: YieldedIterator<T>,
  selector: (next: T) => TSelect,
): YieldedIterator<T> {
  const set = new Set<TSelect>();
  for (const next of generator) {
    const key = selector(next);
    if (set.has(key)) {
      continue;
    }
    set.add(key);
    yield next;
  }
}

export async function* distinctByAsync<T, TSelect>(
  generator: YieldedAsyncGenerator<T>,
  selector: (next: T) => PromiseOrNot<TSelect>,
): YieldedAsyncGenerator<T> {
  const set = new Set<TSelect>();
  for await (const next of generator) {
    const key = await selector(next);
    if (set.has(key)) continue;
    set.add(key);
    yield next;
  }
}
