import {
  type AsyncIterableYielded,
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
  type SyncIterableYielded,
  type SyncSingleYielded,
} from "../types";
import { isGeneratorFunction } from "util/types";
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";
import { syncIterableYielded } from "./syncIterableYielded.ts";
import { syncSingleYielded } from "./syncSingleYielded.ts";
import { _internalY } from "../utils";

/**
 * creates a yielded from the given providers
 *
 * @example
 * yielded(async function*() {
 *   yield * getUsersByGroup(groupId);
 * })
 *  .filter(filterUsers)
 *  .map(mapUsers)
 *  .groupBy()
 *  .collect() // ...
 *
 * @example
 * yielded([1,2,3])
 * .map(n => n * 2)
 * .collect() // [2,4,6]
 *
 * @example
 * yielded(1)
 * .map(n => n * 2)
 * .collect() // [2]
 *
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

function yielded(provider: any) {
  if (isAsyncGeneratorFunction<any>(provider)) {
    return asyncIterableAYielded(provider);
  }
  if (isGeneratorFunction(provider)) {
    return syncIterableYielded(provider);
  }
  if (provider.asyncIterator) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return asyncIterableAYielded(async function* createAsyncSource(
      signal: any,
    ): AsyncGenerator<any, void, undefined & void> {
      if (signal?.aborted) return;
      for await (const next of provider) {
        if (signal?.aborted) return;
        yield next;
      }
    });
  }
  if (typeof provider === "function") {
    return syncSingleYielded(function* singleYieldedSyncProvider(signal) {
      yield provider(signal);
    }, _internalY.getUndefined);
  }
  if (!provider[Symbol.iterator]) {
    return syncSingleYielded(function* singleYieldedSyncProvider(signal) {
      if (signal.aborted) return;
      yield provider;
    }, _internalY.getUndefined);
  }
  return syncIterableYielded(function* createSyncSource(signal): Generator<
    any,
    void,
    undefined & void
  > {
    if (signal?.aborted) return;
    for (const next of provider) {
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
