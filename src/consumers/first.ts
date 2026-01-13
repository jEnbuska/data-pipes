import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../types";

export function firstSync<TInput, TDefault>(
  source: SyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): TInput | TDefault {
  if (signal.aborted) return getDefault();
  const result = source().next();
  if (signal.aborted || result.done) return getDefault();
  return result.value;
}

export async function firstAsync<TInput, TDefault>(
  source: AsyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): Promise<TInput | TDefault> {
  const resolvable = Promise.withResolvers<TDefault>();
  if (signal.aborted) return getDefault();
  signal.addEventListener("abort", () => resolvable.resolve(getDefault()));
  return Promise.race([
    resolvable.promise,
    source()
      .next()
      .then((result) => (result.done ? getDefault() : result.value)),
  ]);
}
