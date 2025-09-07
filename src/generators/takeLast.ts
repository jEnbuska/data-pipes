import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
  type AsyncGeneratorMiddlewareReturn,
} from "../types.ts";
import { toArrayAsync } from "../consumers/toArray.ts";

/**
 * takes the last `count` items produced by the generator and yields them to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  takeLast(2)
 * ).toArray() // [2,3]
 */
export function takeLast<ImperativeTInput = never>(count: number) {
  return function* takeLastGenerator<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    const array = [...generator];
    yield* array.slice(Math.max(array.length - count, 0));
  };
}

export function takeLastAsync<ImperativeTInput = never>(count: number) {
  return async function* takeLastAsyncGenerator<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorMiddlewareReturn<TInput> {
    const array = await toArrayAsync()(generator);
    yield* array.slice(Math.max(array.length - count, 0));
  };
}
