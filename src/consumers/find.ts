import type { YieldedAsyncProvider, YieldedSyncProvider } from "../types.ts";

export function findSync<TInput>(
  invoke: YieldedSyncProvider<TInput>,
  predicate: (value: TInput, index: number) => unknown,
): TInput | undefined {
  return invoke().find(predicate);
}

export async function findAsync<TInput>(
  invoke: YieldedAsyncProvider<TInput>,
  predicate: (value: TInput, index: number) => unknown,
): Promise<TInput | undefined> {
  const index = 0;
  for await (const next of invoke()) {
    if (await predicate(next, index)) return next;
  }
}
