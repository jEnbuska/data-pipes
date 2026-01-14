import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
  type IterableAsyncYielded,
  type IterableSyncYielded,
  type SingleSyncYielded,
} from "../types";
import { isGeneratorFunction } from "util/types";
import { iterableAsyncYielded } from "./iterableAsyncYielded";
import { iterableSyncYielded } from "./iterableSyncYielded";
import { singleSyncYielded } from "./singleSyncYielded";
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
): IterableAsyncYielded<TInput>;
function yielded<TInput>(
  provider: YieldedSyncProvider<TInput>,
): IterableSyncYielded<TInput>;
function yielded<TInput>(
  asyncIterable: AsyncIterator<TInput>,
): IterableAsyncYielded<TInput>;
function yielded<TInput>(
  iterable: Iterable<TInput>,
): IterableSyncYielded<TInput>;
function yielded<TInput>(
  callback: (signal: AbortSignal) => TInput,
): SingleSyncYielded<TInput, undefined>;
function yielded<TInput>(value: TInput): SingleSyncYielded<TInput, undefined>;

function yielded(provider: any) {
  if (isAsyncGeneratorFunction<any>(provider)) {
    return iterableAsyncYielded(provider);
  }
  if (isGeneratorFunction(provider)) {
    return iterableSyncYielded(provider);
  }
  if (provider.asyncIterator) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return iterableAsyncYielded(async function* createAsyncSource(
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
    return singleSyncYielded(function* singleYieldedSyncProvider(signal) {
      yield provider(signal);
    }, _internalY.getUndefined);
  }
  if (!provider[Symbol.iterator]) {
    return singleSyncYielded(function* singleYieldedSyncProvider(signal) {
      if (signal.aborted) return;
      yield provider;
    }, _internalY.getUndefined);
  }
  return iterableSyncYielded(function* createSyncSource(signal): Generator<
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
