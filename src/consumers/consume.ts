import { type AsyncYieldedProvider, type SyncYieldedProvider } from "../types";
import { _internalYielded } from "../utils";

export function consumeSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  signal = new AbortController().signal,
): void {
  if (signal.aborted) return;
  for (const _ of source()) {
    if (signal.aborted) return;
    /* iterate until done */
  }
}

export async function consumeAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  signal = new AbortController().signal,
): Promise<void> {
  const resolvable = Promise.withResolvers<void>();
  if (signal.aborted) return;
  signal.addEventListener("abort", () => resolvable.resolve());
  return Promise.race([
    resolvable.promise,
    _internalYielded.invoke(async function () {
      for await (const _ of source()) {
        if (signal?.aborted) return resolvable.promise;
      }
    }),
  ]);
}
