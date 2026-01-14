import { type SyncYieldedProvider, type AsyncYieldedProvider } from "../types";
import { _internalYielded } from "../utils";

export function toArraySync<TInput>(
  source: SyncYieldedProvider<TInput>,
  signal = new AbortController().signal,
): TInput[] {
  const acc: TInput[] = [];
  if (!signal) return acc;

  for (const next of source(signal)) {
    if (signal.aborted) return [];
    acc.push(next);
  }
  return acc;
}

export async function toArrayAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  signal = new AbortController().signal,
): Promise<Array<Awaited<TInput>>> {
  const acc: TInput[] = [];
  const resolvable = Promise.withResolvers<Array<Awaited<TInput>>>();
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    _internalYielded.invoke(async function () {
      for await (const next of source(signal)) {
        if (signal.aborted) return [];
        acc.push(next);
      }
      return acc;
    }),
  ]) as any;
}

export function toArraySyncFromReturn<TInput>(
  source: SyncYieldedProvider<TInput, TInput[]>,
  signal = new AbortController().signal,
): TInput[] {
  if (signal.aborted) return [];
  const generator = source(signal);
  let result = generator.next();
  while (true) {
    if (signal.aborted) return [];
    if (result.done) return result.value ?? [];
    /* Don't create a new list since the list is return's the list as is */
    result = generator.next();
  }
}

export function toArrayAsyncFromReturn<TInput>(
  source: AsyncYieldedProvider<TInput, TInput[]>,
  signal = new AbortController().signal,
): Promise<Array<Awaited<TInput>>> {
  const resolvable = Promise.withResolvers<any[]>();
  if (signal.aborted) return Promise.resolve([]);
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    _internalYielded.invoke(async function () {
      const generator = source(signal);
      let result = await generator.next();
      while (true) {
        if (signal.aborted) return [];
        if (result.done) return result.value ?? [];
        result = await generator.next();
      }
    }),
  ]) as Promise<Array<Awaited<TInput>>>;
}
