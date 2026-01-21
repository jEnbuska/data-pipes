import { _yielded } from "../_internal.ts";
import { type YieldedAsyncProvider, type YieldedProvider } from "../types.ts";

export function consumeSync<In>(
  provider: YieldedProvider<In>,
  signal: AbortSignal = new AbortController().signal,
): void {
  if (signal.aborted) return;
  for (const _ of provider(signal)) {
    if (signal.aborted) return;
    /* iterate until done */
  }
}

export async function consumeAsync<In>(
  provider: YieldedAsyncProvider<In>,
  signal: AbortSignal = new AbortController().signal,
): Promise<void> {
  const resolvable = Promise.withResolvers<void>();
  if (signal.aborted) return;
  signal.addEventListener("abort", () => resolvable.resolve());
  return Promise.race([
    resolvable.promise,
    _yielded.invoke(async function () {
      for await (const _ of provider(signal)) {
        if (signal?.aborted) return resolvable.promise;
      }
    }),
  ]);
}
