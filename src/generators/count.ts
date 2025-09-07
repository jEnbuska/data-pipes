import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../types.ts";
import { toArrayAsync } from "../consumers/toArray.ts";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  count()
 * ).first() // 3
 */
export function count<ImperativeTInput = never>() {
  return function* countGenerator<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<number> {
    yield [...generator].length;
  };
}

export function countAsync<ImperativeTInput = never>() {
  return async function* countAsyncGenerator<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): GeneratorProvider<number, true> {
    const arr = await toArrayAsync()(generator);
    yield arr.length;
  };
}
