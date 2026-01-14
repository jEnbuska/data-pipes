import { type YieldedAsyncProvider, type YieldedSyncProvider } from "../types";
import { _internalY } from "../utils";

export function consumeSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  signal: AbortSignal = new AbortController().signal,
): void {
  if (signal.aborted) return;
  for (const _ of provider(signal)) {
    if (signal.aborted) return;
    /* iterate until done */
  }
}

export async function consumeAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  signal: AbortSignal = new AbortController().signal,
): Promise<void> {
  const resolvable = Promise.withResolvers<void>();
  if (signal.aborted) return;
  signal.addEventListener("abort", () => resolvable.resolve());
  return Promise.race([
    resolvable.promise,
    _internalY.invoke(async function () {
      for await (const _ of provider(signal)) {
        if (signal?.aborted) return resolvable.promise;
      }
    }),
  ]);
}
