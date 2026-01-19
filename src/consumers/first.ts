import { type AsyncProvider, type SyncProvider } from "../types.ts";

export function firstSync<TData, TDefault>(
  provider: SyncProvider<TData>,
  signal: AbortSignal | undefined,
): TData | TDefault;
export function firstSync<TData>(args: {
  provider: SyncProvider<TData>;
  optional: true;
}): TData | undefined;
export function firstSync<TData>(
  provider: SyncProvider<TData>,
  signal = new AbortController().signal,
  getDefault?: () => any,
): TData | any {
  if (signal.aborted) return getDefault?.();
  const result = provider(signal).next();
  if (signal.aborted || result.done) return getDefault?.();
  return result.value;
}

export async function firstAsync<TData, TDefault>(
  provider: AsyncProvider<TData>,
  getDefault: () => TDefault,
  signal = new AbortController().signal,
): Promise<TData | TDefault> {
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
export type ExcludeNevers<T extends Record<string, any>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};
