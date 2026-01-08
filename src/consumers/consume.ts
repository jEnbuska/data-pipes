import { type AsyncProviderFunction, type ProviderFunction } from "../types";
import { InternalStreamless } from "../utils";

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
  const resolvable = await InternalStreamless.createResolvable<void>();
  if (signal.aborted) return;
  signal.addEventListener("abort", () => resolvable.resolve());
  return Promise.race([
    resolvable.promise,
    InternalStreamless.invoke(async function () {
      for await (const _ of source()) {
        if (signal?.aborted) return resolvable.promise;
      }
    }),
  ]);
}
