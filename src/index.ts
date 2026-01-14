import { asyncIterableAYielded } from "./create/asyncIterableAYielded.ts";
import { syncIterableYielded } from "./create/syncIterableYielded.ts";
import { syncSingleYielded } from "./create/syncSingleYielded.ts";
import {
  type AsyncIterableYielded,
  type SyncIterableYielded,
  type SyncSingleYielded,
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "./types.ts";
import { _internalY } from "./utils.ts";

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

function yielded<TInput>(
  asyncGeneratorFunction: YieldedAsyncProvider<TInput>,
): AsyncIterableYielded<TInput>;
function yielded<TInput>(
  provider: YieldedSyncProvider<TInput>,
): SyncIterableYielded<TInput>;
function yielded<TInput>(
  asyncIterable: AsyncIterator<TInput>,
): AsyncIterableYielded<TInput>;
function yielded<TInput>(
  iterable: Iterable<TInput>,
): SyncIterableYielded<TInput>;
function yielded<TInput>(
  callback: (signal: AbortSignal) => TInput,
): SyncSingleYielded<TInput, undefined>;
function yielded<TInput>(value: TInput): SyncSingleYielded<TInput, undefined>;

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
    }, _internalY.getUndefined);
  }
  if (!source[Symbol.iterator]) {
    return syncSingleYielded(function* singleYieldedSyncProvider(signal) {
      if (signal.aborted) return;
      yield source;
    }, _internalY.getUndefined);
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

function isAsyncGeneratorFunction<TInput>(
  provider: unknown,
): provider is YieldedAsyncProvider<TInput> {
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
