import type {
  AsyncStreamlessProvider,
  AsyncStreamless,
  StreamlessProvider,
  SyncStreamless,
} from "../types";
import { asyncStreamless } from "./asyncStreamless";
import { isGeneratorFunction } from "util/types";
import { syncStreamless } from "./syncStreamless";
import { InternalStreamless } from "../utils";

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
  asyncGeneratorFunction: AsyncStreamlessProvider<TInput>,
): AsyncStreamless<TInput>;
export function streamless<TInput>(
  source: StreamlessProvider<TInput>,
): SyncStreamless<TInput>;
export function streamless<TInput>(
  asyncIterable: AsyncIterator<TInput>,
): AsyncStreamless<TInput>;
export function streamless<TInput>(
  iterable: Iterable<TInput>,
): SyncStreamless<TInput>;
export function streamless<TInput>(value: TInput): SyncStreamless<TInput>;
export function streamless(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return asyncStreamless(source, InternalStreamless.getUndefined);
  }
  if (isGeneratorFunction(source)) {
    return syncStreamless(source, InternalStreamless.getUndefined);
  }
  if (source.asyncIterator) {
    return asyncStreamless(async function* createAsyncSource(
      signal?: AbortSignal,
    ): AsyncGenerator<any, void, undefined & void> {
      if (signal?.aborted) return;
      for await (const next of source) {
        if (signal?.aborted) return;
        yield next;
      }
    }, InternalStreamless.getUndefined);
  }
  return syncStreamless(function* createSyncSource(
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
  }, InternalStreamless.getUndefined);
}

function isAsyncGeneratorFunction<TInput>(
  source: unknown,
): source is AsyncStreamlessProvider<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}
