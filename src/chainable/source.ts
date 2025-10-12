import { createAsyncChainable } from "./asyncChainable.ts";
import { createChainable } from "./chainable.ts";
import { createAsyncProvider, createGenerator } from "../create-generator.ts";
import {
  type AsyncChainable,
  type AsyncPipeSource,
  type Chainable,
  type SyncPipeSource,
} from "../types.ts";
import { isAsyncGeneratorFunction } from "../utils.ts";

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
  source: SyncPipeSource<TInput>,
): Chainable<TInput>;
export function source(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return createAsyncChainable(createAsyncProvider(source));
  }
  return createChainable(createGenerator(source));
}
