import { type YieldedAsyncProvider, type YieldedProvider } from "../types.ts";

export function firstSync<In, TDefault>(
  provider: YieldedProvider<In>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): T | TDefault {
  if (signal.aborted) return getDefault();
  const result = provider(signal).next();
  if (signal.aborted || result.done) return getDefault();
  return result.value;
}

export async function firstAsync<In, TDefault>(
  provider: YieldedAsyncProvider<In>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): Promise<T | TDefault> {
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
