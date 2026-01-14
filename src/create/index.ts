import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
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

function yielded<TInput>(
  asyncGeneratorFunction: AsyncYieldedProvider<TInput>,
): IterableAsyncYielded<TInput>;
function yielded<TInput>(
  source: SyncYieldedProvider<TInput>,
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

function yielded(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return iterableAsyncYielded(source);
  }
  if (isGeneratorFunction(source)) {
    return iterableSyncYielded(source);
  }
  if (source.asyncIterator) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return iterableAsyncYielded(async function* createAsyncSource(
      signal: any,
    ): AsyncGenerator<any, void, undefined & void> {
      if (signal?.aborted) return;
      for await (const next of source) {
        if (signal?.aborted) return;
        yield next;
      }
    });
  }
  if (typeof source === "function") {
    return singleSyncYielded(function* singleSyncYieldedProvider(signal) {
      yield source(signal);
    }, _internalY.getUndefined);
  }
  if (!source[Symbol.iterator]) {
    return singleSyncYielded(function* singleSyncYieldedProvider(signal) {
      if (signal.aborted) return;
      yield source;
    }, _internalY.getUndefined);
  }
  return iterableSyncYielded(function* createSyncSource(signal): Generator<
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
  source: unknown,
): source is AsyncYieldedProvider<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}
