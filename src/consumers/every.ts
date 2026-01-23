import type { YieldedAsyncProvider, YieldedSyncProvider } from "../types.ts";

export function everySync<TInput>(
  invoke: YieldedSyncProvider<TInput>,
  predicate: (value: TInput, index: number) => unknown,
): boolean {
  return invoke().every(predicate);
}
export async function everyAsync<TInput>(
  invoke: YieldedAsyncProvider<TInput>,
  predicate: (value: TInput, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of invoke()) {
    if (!(await predicate(next, index++))) return false;
  }
  return true;
}
