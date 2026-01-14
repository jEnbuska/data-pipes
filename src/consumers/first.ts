import { type SyncYieldedProvider, type AsyncYieldedProvider } from "../types";

export function firstSync<TInput, TDefault>(
  provider: SyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): TInput | TDefault {
  if (signal.aborted) return getDefault();
  const result = provider(signal).next();
  if (signal.aborted || result.done) return getDefault();
  return result.value;
}

export async function firstAsync<TInput, TDefault>(
  provider: AsyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): Promise<TInput | TDefault> {
  const resolvable = Promise.withResolvers<TDefault>();

  if (signal.aborted) return getDefault();
  signal.addEventListener("abort", () => resolvable.resolve(getDefault()));
  return Promise.race([
    resolvable.promise,
    provider(signal)
      .next()
      .then((result) => (result.done ? getDefault() : result.value)),
  ]);
}
