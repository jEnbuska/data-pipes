import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* distinctBySync<TInput, TSelect>(
  generator: YieldedIterator<TInput>,
  selector: (next: TInput) => TSelect,
): YieldedIterator<TInput> {
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

export async function* distinctByAsync<TInput, TSelect>(
  generator: YieldedAsyncGenerator<TInput>,
  selector: (next: TInput) => Promise<TSelect> | TSelect,
): YieldedAsyncGenerator<TInput> {
  const set = new Set<TSelect>();
  for await (const next of generator) {
    const key = await selector(next);
    if (set.has(key)) continue;
    set.add(key);
    yield next;
  }
}
