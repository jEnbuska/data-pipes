import { createAsyncChainable } from "../chainable/asyncChainable.ts";
import { createChainable } from "../chainable/chainable.ts";
import {
  type AsyncChainable,
  type AsyncPipeSource,
  type Chainable,
  type PipeSource,
} from "../types.ts";
import { isAsyncGeneratorFunction } from "../utils.ts";
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
  source: AsyncPipeSource<TInput>,
): AsyncChainable<TInput>;
export function source<TInput>(
  source: PipeSource<TInput> | TInput[] | TInput,
): Chainable<TInput>;
export function source(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return createAsyncChainable(source);
  }
  if (isGeneratorFunction(source)) {
    return createChainable(source);
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
  });
}
