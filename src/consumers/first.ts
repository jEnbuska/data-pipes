import { type ProviderFunction, type AsyncProviderFunction } from "../types";
import { InternalStreamless } from "../utils";

export function first<TInput, TDefault>(
  source: ProviderFunction<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): TInput | TDefault {
  if (signal.aborted) return getDefault();
  const result = source().next();
  if (signal.aborted || result.done) return getDefault();
  return result.value;
}

export async function firstAsync<TInput, TDefault>(
  source: AsyncProviderFunction<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): Promise<TInput | TDefault> {
  const resolvable = await InternalStreamless.createResolvable<TDefault>();
  if (signal.aborted) return getDefault();
  signal.addEventListener("abort", () => resolvable.resolve(getDefault()));
  return Promise.race([
    resolvable.promise,
    source()
      .next()
      .then((result) => (result.done ? getDefault() : result.value)),
  ]);
}
