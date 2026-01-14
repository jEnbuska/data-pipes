import type {
  AsyncYieldedProvider,
  SyncYieldedProvider,
  IterableAsyncYielded,
  IterableSyncYielded,
  SingleSyncYielded,
} from "../types";
import { isGeneratorFunction } from "util/types";
import { iterableAsyncYielded } from "./iterableAsyncYielded";
import { iterableSyncYielded } from "./iterableSyncYielded";
import { singleSyncYielded } from "./singleSyncYielded";
import { _internalYielded } from "../utils.ts";

/**
 * creates a yielded from the given sources
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

export function yielded<TInput>(
  asyncGeneratorFunction: AsyncYieldedProvider<TInput>,
): IterableAsyncYielded<TInput>;
export function yielded<TInput>(
  source: SyncYieldedProvider<TInput>,
): IterableSyncYielded<TInput>;
export function yielded<TInput>(
  asyncIterable: AsyncIterator<TInput>,
): IterableAsyncYielded<TInput>;
export function yielded<TInput>(
  iterable: Iterable<TInput>,
): IterableSyncYielded<TInput>;
export function yielded<TInput>(
  callback: () => TInput,
): SingleSyncYielded<TInput, undefined>;
export function yielded<TInput>(
  value: TInput,
): SingleSyncYielded<TInput, undefined>;

export function yielded(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return iterableAsyncYielded(source);
  }
  if (isGeneratorFunction(source)) {
    return iterableSyncYielded(source);
  }
  if (source.asyncIterator) {
    return iterableAsyncYielded(async function* createAsyncSource(
      signal?: AbortSignal,
    ): AsyncGenerator<any, void, undefined & void> {
      if (signal?.aborted) return;
      for await (const next of source) {
        if (signal?.aborted) return;
        yield next;
      }
    });
  }
  if (typeof source === "function") {
    return singleSyncYielded(function* singleSyncYieldedProvider() {
      yield source();
    }, _internalYielded.getUndefined);
  }
  if (!source[Symbol.iterator]) {
    return singleSyncYielded(function* singleSyncYieldedProvider() {
      yield source;
    }, _internalYielded.getUndefined);
  }
  return iterableSyncYielded(function* createSyncSource(
    signal?: AbortSignal,
  ): Generator<any, void, undefined & void> {
    if (signal?.aborted) return;
    for (const next of source) {
      if (signal?.aborted) return;
      yield next;
    }
  });
}

function isAsyncGeneratorFunction<TInput>(
  source: unknown,
): source is AsyncYieldedProvider<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}
