import { _yielded } from "./_internal.ts";
import { asyncIterableAYielded } from "./create/asyncIterableAYielded.ts";
import { syncIterableYielded } from "./create/syncIterableYielded.ts";
import { syncSingleYielded } from "./create/syncSingleYielded.ts";
import {
  type AsyncIterableYielded,
  type AsyncProvider,
  type SyncIterableYielded,
  type SyncProvider,
  type SyncSingleYielded,
} from "./types.ts";

/**
 * creates a yielded from the given providers
 *
 * @example
 * yielded(async function*() {
 *   yield* await getUsersByGroup(groupId);
 * })
 *  .groupBy(user => user.id)
 *  .resolve() satisfies Promise<Record<string, User>>
 *
 * @example
 * yielded([1,2,3])
 *  .map(n => n * 2)
 *  .resolve() satisfies number[] // [2,4,6]
 *
 * @example
 * yielded(1)
 *  .map(n => n * 2)
 *  .resolve() satisfies number | undefined // 2
 */

function yielded<TData>(
  asyncGeneratorFunction: AsyncProvider<TData>,
): AsyncIterableYielded<TData>;
function yielded<TData>(
  provider: SyncProvider<TData>,
): SyncIterableYielded<TData>;
function yielded<TData>(
  asyncIterable: AsyncIterator<TData>,
): AsyncIterableYielded<TData>;
function yielded<TData>(iterable: Iterable<TData>): SyncIterableYielded<TData>;
function yielded<TData>(
  callback: (signal: AbortSignal) => TData,
): SyncSingleYielded<TData, undefined>;
function yielded<TData>(value: TData): SyncSingleYielded<TData, undefined>;

function yielded(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return asyncIterableAYielded(source);
  }
  if (isGeneratorFunction(source)) {
    return syncIterableYielded(source);
  }
  if (source.asyncIterator) {
    return asyncIterableAYielded(
      async function* createAsyncSource(
        signal,
      ): AsyncGenerator<any, void, undefined & void> {
        if (signal?.aborted) return;
        for await (const next of source) {
          if (signal?.aborted) return;
          yield next;
        }
      },
    );
  }
  if (typeof source === "function") {
    return syncSingleYielded(function* singleYieldedSyncProvider(signal) {
      yield source(signal);
    }, _yielded.getUndefined);
  }
  if (!source[Symbol.iterator]) {
    return syncSingleYielded(function* singleYieldedSyncProvider(signal) {
      if (signal.aborted) return;
      yield source;
    }, _yielded.getUndefined);
  }
  return syncIterableYielded(function* createSyncSource(signal): Generator<
    any,
    void,
    undefined & void
  > {
    if (signal?.aborted) return;
    for (const next of source) {
      if (signal?.aborted) return;
      yield next;
    }
  });
}

export default yielded;

function isAsyncGeneratorFunction<TData>(
  provider: unknown,
): provider is AsyncProvider<TData> {
  return (
    Boolean(provider) &&
    Object.getPrototypeOf(provider).constructor.name ===
      "AsyncGeneratorFunction"
  );
}
function isGeneratorFunction(fn: unknown): fn is (...args: any[]) => Generator {
  return (
    typeof fn === "function" && fn.constructor.name === "GeneratorFunction"
  );
}
