import { type SyncYieldedProvider, type AsyncYieldedProvider } from "../types";

export function firstSync<TInput, TDefault>(
  source: SyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): TInput | TDefault {
  if (signal.aborted) return getDefault();
  const result = source(signal).next();
  if (signal.aborted || result.done) return getDefault();
  return result.value;
}

export async function firstAsync<TInput, TDefault>(
  source: AsyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): Promise<TInput | TDefault> {
  const resolvable = Promise.withResolvers<TDefault>();

  if (signal.aborted) return getDefault();
  signal.addEventListener("abort", () => resolvable.resolve(getDefault()));
  return Promise.race([
    resolvable.promise,
    source(signal)
      .next()
      .then((result) => (result.done ? getDefault() : result.value)),
  ]);
}
