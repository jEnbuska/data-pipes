import { type SyncYieldedProvider, type AsyncYieldedProvider } from "../types";
import { _internalY } from "../utils";

export function toArraySync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  signal = new AbortController().signal,
): TInput[] {
  const acc: TInput[] = [];
  if (!signal) return acc;

  for (const next of provider(signal)) {
    if (signal.aborted) return [];
    acc.push(next);
  }
  return acc;
}

export async function toArrayAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  signal = new AbortController().signal,
): Promise<Array<Awaited<TInput>>> {
  const acc: TInput[] = [];
  const resolvable = Promise.withResolvers<Array<Awaited<TInput>>>();
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    _internalY.invoke(async function () {
      for await (const next of provider(signal)) {
        if (signal.aborted) return [];
        acc.push(next);
      }
      return acc;
    }),
  ]) as any;
}

export function toArraySyncFromReturn<TInput>(
  provider: SyncYieldedProvider<TInput, TInput[]>,
  signal = new AbortController().signal,
): TInput[] {
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

export function toArrayAsyncFromReturn<TInput>(
  provider: AsyncYieldedProvider<TInput, TInput[]>,
  signal = new AbortController().signal,
): Promise<Array<Awaited<TInput>>> {
  const resolvable = Promise.withResolvers<any[]>();
  if (signal.aborted) return Promise.resolve([]);
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    _internalY.invoke(async function () {
      using generator = _internalY.getDisposableAsyncGenerator(
        provider,
        signal,
      );
      let result = await generator.next();
      while (true) {
        if (signal.aborted) return [];
        if (result.done) return result.value ?? [];
        result = await generator.next();
      }
    }),
  ]) as Promise<Array<Awaited<TInput>>>;
}
