import { createAsyncChainable } from "../chainable/asyncChainable.ts";
import { createChainable } from "../chainable/chainable.ts";
import {
  type AsyncChainable,
  type AsyncProviderFunction,
  type SyncChainable,
  type ProviderFunction,
} from "../types.ts";
import { isAsyncGeneratorFunction, returnUndefined } from "../utils.ts";
import { isGeneratorFunction } from "util/types";

/**
 * creates a chainable from the given sources
 *
 * @example
 * source([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * source([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * source(
 *  source([1,2,3]).map(n => n * 2)
 * ).map(n => n * 2)
 *  .toArray() // [4,8,12]
 */

export function source<TInput>(
  source: AsyncProviderFunction<TInput>,
): AsyncChainable<TInput>;
export function source<TInput>(
  source: ProviderFunction<TInput> | TInput[] | TInput,
): SyncChainable<TInput>;
export function source(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return createAsyncChainable(source, returnUndefined);
  }
  if (isGeneratorFunction(source)) {
    return createChainable(source, returnUndefined);
  }
  return createChainable(function* dataSource(
    signal?: AbortSignal,
  ): Generator<any, void, undefined & void> {
    if (signal?.aborted) return;
    if (!Array.isArray(source)) yield source;
    else {
      for (const next of source) {
        if (signal?.aborted) return;
        yield next;
      }
    }
  }, returnUndefined);
}
