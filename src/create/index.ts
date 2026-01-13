import type {
  AsyncStreamlessProvider,
  SyncStreamlessProvider,
  IterableAsyncStreamless,
  IterableSyncStreamless,
  SingleSyncStreamless,
} from "../types";
import { isGeneratorFunction } from "util/types";
import { iterableAsyncStreamless } from "./iterableAsyncStreamless";
import { iterableSyncStreamless } from "./iterableSyncStreamless";
import { singleSyncStreamless } from "./singleSyncStreamless";
import { _internalStreamless } from "../utils.ts";

/**
 * creates a streamless from the given sources
 *
 * @example
 * streamless(async function*() {
 *   yield * getUsersByGroup(groupId);
 * })
 *  .filter(filterUsers)
 *  .map(mapUsers)
 *  .groupBy()
 *  .collect() // ...
 *
 * @example
 * streamless([1,2,3])
 * .map(n => n * 2)
 * .collect() // [2,4,6]
 *
 * @example
 * streamless(1)
 * .map(n => n * 2)
 * .collect() // [2]
 *
 */

export function streamless<TInput>(
  asyncGeneratorFunction: AsyncStreamlessProvider<TInput>,
): IterableAsyncStreamless<TInput>;
export function streamless<TInput>(
  source: SyncStreamlessProvider<TInput>,
): IterableSyncStreamless<TInput>;
export function streamless<TInput>(
  asyncIterable: AsyncIterator<TInput>,
): IterableAsyncStreamless<TInput>;
export function streamless<TInput>(
  iterable: Iterable<TInput>,
): IterableSyncStreamless<TInput>;
export function streamless<TInput>(
  value: TInput,
): SingleSyncStreamless<TInput, undefined>;
export function streamless(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return iterableAsyncStreamless(source);
  }
  if (isGeneratorFunction(source)) {
    return iterableSyncStreamless(source);
  }
  if (source.asyncIterator) {
    return iterableAsyncStreamless(async function* createAsyncSource(
      signal?: AbortSignal,
    ): AsyncGenerator<any, void, undefined & void> {
      if (signal?.aborted) return;
      for await (const next of source) {
        if (signal?.aborted) return;
        yield next;
      }
    });
  }
  if (!source[Symbol.iterator]) {
    return singleSyncStreamless(function* singleSyncStreamlessProvider() {
      yield source;
    }, _internalStreamless.getUndefined);
  }
  return iterableSyncStreamless(function* createSyncSource(
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
): source is AsyncStreamlessProvider<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}
