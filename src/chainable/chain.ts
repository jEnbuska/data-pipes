import {
  type SyncPipeSource,
  type AsyncPipeSource,
  type AsyncChainable,
  type Chainable,
} from "../types.ts";
import { createProvider, createAsyncProvider } from "../create-provider.ts";
import { createAsyncChainable } from "./asyncChainable.ts";
import { createChainable } from "./chainable.ts";
import { isAsyncGeneratorFunction } from "./utils.ts";

/**
 * creates a chainable from the given sources
 *
 * @example
 * chainable([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * chainable([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * chainable(
 *  chainable([1,2,3]).map(n => n * 2)
 * ).map(n => n * 2)
 *  .toArray() // [4,8,12]
 */

export function chain<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncChainable<TInput>;
export function chain<TInput>(
  source: SyncPipeSource<TInput>,
): Chainable<TInput>;
export function chain(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return createAsyncChainable(createAsyncProvider(source));
  }
  return createChainable(createProvider(source));
}
