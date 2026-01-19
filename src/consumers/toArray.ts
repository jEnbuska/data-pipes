import { _yielded } from "../_internal.ts";
import { type AsyncProvider, type SyncProvider } from "../types.ts";

export function toArraySync<TData>(
  provider: SyncProvider<TData>,
  signal = new AbortController().signal,
): TData[] {
  const acc: TData[] = [];
  if (!signal) return acc;

  for (const next of provider(signal)) {
    if (signal.aborted) return [];
    acc.push(next);
  }
  return acc;
}

export async function toArrayAsync<TData>(
  provider: AsyncProvider<TData>,
  signal = new AbortController().signal,
): Promise<TData[]> {
  const acc: TData[] = [];
  const resolvable = Promise.withResolvers<TData[]>();
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    _yielded.invoke(async function () {
      for await (const next of provider(signal)) {
        if (signal.aborted) return [];
        acc.push(next);
      }
      return acc;
    }),
  ]) as any;
}

export function toArraySyncFromReturn<TData>(
  provider: SyncProvider<TData, TData[]>,
  signal = new AbortController().signal,
): TData[] {
  if (signal.aborted) return [];
  using generator = Object.assign(provider(signal), {
    [Symbol.dispose]() {
      generator.return([]);
    },
  });
  let result = generator.next();
  while (true) {
    if (signal.aborted) return [];
    if (result.done) return result.value ?? [];
    /* Don't create a new list since the list is return's the list as is */
    result = generator.next();
  }
}

export function toArrayAsyncFromReturn<TData>(
  provider: AsyncProvider<TData, TData[]>,
  signal = new AbortController().signal,
): Promise<TData[]> {
  const resolvable = Promise.withResolvers<any[]>();
  if (signal.aborted) return Promise.resolve([]);
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    _yielded.invoke(async function () {
      using generator = _yielded.useAsyncGenerator(provider, signal);
      let result = await generator.next();
      while (true) {
        if (signal.aborted) return [];
        if (result.done) return result.value ?? [];
        result = await generator.next();
      }
    }),
  ]) as Promise<Array<Awaited<TData>>>;
}
