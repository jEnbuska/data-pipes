import { type PipeSource, type AsyncPipeSource } from "../types.ts";
import { createResolvable } from "../resolvable.ts";

export function first<TInput, TDefault = undefined>(
  source: PipeSource<TInput>,
  defaultValue: TDefault,
  signal = new AbortController().signal,
): TInput | TDefault {
  if (signal.aborted) return defaultValue;
  const result = source().next();
  if (signal.aborted || result.done) return defaultValue;
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
    source()
      .next()
      .then((result) => (result.done ? defaultValue : result.value)),
  ]);
}
