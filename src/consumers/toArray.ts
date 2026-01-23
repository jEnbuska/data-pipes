import type { YieldedAsyncProvider, YieldedSyncProvider } from "../types.ts";

export function toArraySync<TInput, TReturn = unknown>(
  invoke: YieldedSyncProvider<TInput, TReturn>,
  returnsResult: TReturn extends TInput[] ? true : false,
): TInput[] {
  const generator = invoke();
  if (!returnsResult) {
    return generator.toArray();
  }
  while (true) {
    const next = generator.next();
    if (next.done) return next.value as TInput[];
  }
}

export async function toArrayAsync<TInput, TReturn = unknown>(
  invoke: YieldedAsyncProvider<TInput, TReturn>,
  returnsResult: TReturn extends TInput[] ? true : false,
): Promise<TInput[]> {
  const generator = invoke();
  if (returnsResult) {
    while (true) {
      const next = await generator.next();
      if (next.done) return next.value as TInput[];
    }
  }
  const acc: TInput[] = [];
  for await (const next of generator) acc.push(next);
  return acc;
}
