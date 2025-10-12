import { type PipeSource, type AsyncPipeSource } from "../types.ts";
import { createResolvable } from "../resolvable.ts";

export function first<TInput>(
  source: PipeSource<TInput>,
  signal = new AbortController().signal,
): TInput | void {
  if (signal.aborted) return;
  const result = source(signal).next();
  return result.value;
}

export async function firstAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  signal = new AbortController().signal,
): Promise<TInput | void> {
  const resolvable = await createResolvable<TInput | void>();
  if (signal?.aborted) {
    return;
  }
  signal?.addEventListener("abort", () => resolvable.resolve());
  return Promise.race([
    resolvable.promise,
    source(signal)
      .next()
      .then((result) => result.value),
  ]);
}
