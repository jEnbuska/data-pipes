import { type PipeSource, type AsyncPipeSource } from "../types.ts";
import { createResolvable } from "../resolvable.ts";

export function first<TInput>(
  source: PipeSource<TInput>,
  signal = new AbortController().signal,
): TInput | void {
  if (signal.aborted) return;
  const result = source(undefined).next();
  return result.value;
}

export async function firstAsync<TInput, TDefault = void>(
  source: AsyncPipeSource<TInput>,
  defaultValue: TDefault,
  signal = new AbortController().signal,
): Promise<TInput | TDefault> {
  const resolvable = await createResolvable<TDefault>();
  if (signal.aborted) return defaultValue;
  signal.addEventListener("abort", () => resolvable.resolve(defaultValue));
  return Promise.race([
    resolvable.promise,
    source(signal)
      .next()
      .then((result) => (result.done ? defaultValue : result.value)),
  ]);
}
