import type { YieldedAsyncProvider, YieldedSyncProvider } from "../types.ts";

export function someSync<TInput>(
  invoke: YieldedSyncProvider<TInput>,
  predicate: (next: TInput, index: number) => boolean,
): boolean {
  return invoke().some(predicate);
}
export async function someAsync<TInput>(
  invoke: YieldedAsyncProvider<TInput>,
  predicate: (value: TInput, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of invoke()) {
    if (await predicate(next, index++)) return true;
  }
  return false;
}
