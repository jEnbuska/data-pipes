import { _yielded } from "../_internal.ts";
import { type YieldedAsyncProvider, type YieldedProvider } from "../types.ts";

export function toArraySync<In>(
  provider: YieldedProvider<In>,
  signal = new AbortController().signal,
): In[] {
  const acc: In[] = [];
  if (!signal) return acc;

  for (const next of provider(signal)) {
    if (signal.aborted) return [];
    acc.push(next);
  }
  return acc;
}

export async function toArrayAsync<In>(
  provider: YieldedAsyncProvider<In>,
  signal = new AbortController().signal,
): Promise<Array<Awaited<In>>> {
  const acc: In[] = [];
  const resolvable = Promise.withResolvers<Array<Awaited<In>>>();
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

export function toArraySyncFromReturn<In>(
  provider: YieldedProvider<In, In[]>,
  signal = new AbortController().signal,
): In[] {
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

export function toArrayAsyncFromReturn<In>(
  provider: YieldedAsyncProvider<In, In[]>,
  signal = new AbortController().signal,
): Promise<Array<Awaited<In>>> {
  const resolvable = Promise.withResolvers<any[]>();
  if (signal.aborted) return Promise.resolve([]);
  signal.addEventListener("abort", () => resolvable.resolve([]));
  return Promise.race([
    resolvable.promise,
    _yielded.invoke(async function () {
      using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
      let result = await generator.next();
      while (true) {
        if (signal.aborted) return [];
        if (result.done) return result.value ?? [];
        result = await generator.next();
      }
    }),
  ]) as Promise<Array<Awaited<In>>>;
}
