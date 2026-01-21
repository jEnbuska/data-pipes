import { _yielded } from "./_internal.ts";
import { asyncIterableAYielded } from "./create/asyncIterableAYielded.ts";
import { syncIterableYielded } from "./create/syncIterableYielded.ts";
import { syncSingleYielded } from "./create/syncSingleYielded.ts";
import {
  type AsyncIterableYielded,
  type SyncIterableYielded,
  type SyncSingleYielded,
  type YieldedAsyncProvider,
  type YieldedProvider,
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

function yielded<In>(
  asyncGeneratorFunction: YieldedAsyncProvider<In>,
): AsyncIterableYielded<In>;
function yielded<In>(provider: YieldedProvider<In>): SyncIterableYielded<In>;
function yielded<In>(
  asyncIterable: AsyncIterator<In>,
): AsyncIterableYielded<In>;
function yielded<In>(iterable: Iterable<In>): SyncIterableYielded<In>;
function yielded<In>(
  callback: (signal: AbortSignal) => T,
): SyncSingleYielded<In, undefined>;
function yielded<In>(value: T): SyncSingleYielded<In, undefined>;

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

function isAsyncGeneratorFunction<In>(
  provider: unknown,
): provider is YieldedAsyncProvider<In> {
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
