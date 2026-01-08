import type {
  AsyncProviderFunction,
  AsyncChainable,
  ProviderFunction,
  SyncChainable,
} from "./types.ts";
import { isAsyncGeneratorFunction, returnUndefined } from "./utils.ts";
import { createAsyncChainable } from "./chainable/asyncChainable.ts";
import { isGeneratorFunction } from "util/types";
import { createChainable } from "./chainable/chainable.ts";

export * from "./consumers";
export * from "./generators";
export * from "./producer.ts";

/**
 * creates a streamless from the given sources
 *
 * @example
 * streamless(async function*(){
 *   yield 1;
 *   yield 2;
 * })
 *  .map(n => n * 2)
 *  .toArray() // [2,4]
 *
 * @example
 * streamless([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * streamless(1)
 * .map(n => n * 2)
 * .toArray() // [1]
 */

export function streamless<TInput>(
  asyncGeneratorFunction: AsyncProviderFunction<TInput>,
): AsyncChainable<TInput>;
export function streamless<TInput>(
  source: ProviderFunction<TInput>,
): SyncChainable<TInput>;
export function streamless<TInput>(
  asyncIterable: AsyncIterator<TInput>,
): AsyncChainable<TInput>;
export function streamless<TInput>(
  iterable: Iterable<TInput>,
): SyncChainable<TInput>;
export function streamless<TInput>(value: TInput): SyncChainable<TInput>;
export function streamless(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return createAsyncChainable(source, returnUndefined);
  }
  if (isGeneratorFunction(source)) {
    return createChainable(source, returnUndefined);
  }
  if (source.asyncIterator) {
    return createAsyncChainable(async function* asyncDatastreamless(
      signal?: AbortSignal,
    ): AsyncGenerator<any, void, undefined & void> {
      if (signal?.aborted) return;
      for await (const next of source) {
        if (signal?.aborted) return;
        yield next;
      }
    }, returnUndefined);
  }
  return createChainable(function* datastreamless(
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
