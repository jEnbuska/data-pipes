import type { YieldedAsyncProvider, YieldedSyncProvider } from "../types.ts";

export function forEachSync<TInput>(
  invoke: YieldedSyncProvider<TInput>,
  callback: (next: TInput, index: number) => unknown,
): void {
  return invoke().forEach(callback);
}

export async function forEachAsync<TInput>(
  invoke: YieldedAsyncProvider<TInput>,
  callback: (next: TInput, index: number) => unknown,
): Promise<void> {
  let index = 0;
  for await (const next of invoke()) callback(next, index++);
}
