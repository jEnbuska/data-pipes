import type {
  AsyncProviderFunction,
  AsyncStreamless,
  ProviderFunction,
  SyncStreamless,
} from "../types";
import { InternalStreamless } from "../utils";
import { asyncStreamless } from "./asyncStreamless";
import { isGeneratorFunction } from "util/types";
import { syncStreamless } from "./syncStreamless";

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
 *  .toArray() // ...
 *
 * @example
 * streamless([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * streamless(1)
 * .map(n => n * 2)
 * .toArray() // [2]
 *
 */

export function streamless<TInput>(
  asyncGeneratorFunction: AsyncProviderFunction<TInput>,
): AsyncStreamless<TInput>;
export function streamless<TInput>(
  source: ProviderFunction<TInput>,
): SyncStreamless<TInput>;
export function streamless<TInput>(
  asyncIterable: AsyncIterator<TInput>,
): AsyncStreamless<TInput>;
export function streamless<TInput>(
  iterable: Iterable<TInput>,
): SyncStreamless<TInput>;
export function streamless<TInput>(value: TInput): SyncStreamless<TInput>;
export function streamless(source: any) {
  const returnUndefined = InternalStreamless.createDefault(undefined);
  if (InternalStreamless.isAsyncGeneratorFunction<any>(source)) {
    return asyncStreamless(source, returnUndefined);
  }
  if (isGeneratorFunction(source)) {
    return syncStreamless(source, returnUndefined);
  }
  if (source.asyncIterator) {
    return asyncStreamless(async function* asyncDatastreamless(
      signal?: AbortSignal,
    ): AsyncGenerator<any, void, undefined & void> {
      if (signal?.aborted) return;
      for await (const next of source) {
        if (signal?.aborted) return;
        yield next;
      }
    }, returnUndefined);
  }
  return syncStreamless(function* datastreamless(
    signal?: AbortSignal,
  ): Generator<any, void, undefined & void> {
    if (signal?.aborted) return;
    if (!source[Symbol.iterator]) {
      yield source;
      return undefined;
    }
    for (const next of source) {
      if (signal?.aborted) return;
      yield next;
    }
  }, returnUndefined);
}
