import {
  type AsyncStreamlessProvider,
  type StreamlessProvider,
} from "../types";
import { InternalStreamless } from "../utils";

export function consume<TInput>(
  source: StreamlessProvider<TInput>,
  signal = new AbortController().signal,
): void {
  if (signal.aborted) return;
  for (const _ of source()) {
    if (signal.aborted) return;
    /* iterate until done */
  }
}

export async function consumeAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  signal = new AbortController().signal,
): Promise<void> {
  const resolvable = Promise.withResolvers<void>();
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
