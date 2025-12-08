import { type AsyncProviderFunction, type ProviderFunction } from "../types.ts";
import { invoke } from "../utils.ts";
import { createResolvable } from "../resolvable.ts";

export function consume<TInput>(
  source: ProviderFunction<TInput>,
  signal = new AbortController().signal,
): void {
  if (signal.aborted) return;
  for (const _ of source()) {
    if (signal.aborted) return;
    /* iterate until done */
  }
}

export async function consumeAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  signal = new AbortController().signal,
): Promise<void> {
  const resolvable = await createResolvable<void>();
  if (signal.aborted) return;
  signal.addEventListener("abort", () => resolvable.resolve());
  return Promise.race([
    resolvable.promise,
    invoke(async function () {
      for await (const _ of source()) {
        if (signal?.aborted) return resolvable.promise;
      }
    }),
  ]);
}
