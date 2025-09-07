import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../../types";
import { toArrayAsync } from "../../consumers/toArray/toArray.ts";

/**
 * yields the items in reverse order after the generator is consumed
 * @example
 * pipe(
 *  [1,2,3],
 *  reverse()
 * ).toArray() // [3,2,1]
 */
export function reverse<ImperativeTInput = never>() {
  return function* reverseGenerator<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    yield* [...generator].reverse();
  };
}

export function reverseAsync<ImperativeTInput = never>() {
  return async function* reverseAsyncGenerator<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGenerator<TInput, void, undefined & void> {
    const awaited = await toArrayAsync()(generator);
    yield* awaited.reverse();
  };
}
