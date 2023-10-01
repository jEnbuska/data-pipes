import { type GeneratorProvider } from "../../types";

/**
 * yields the items in reverse order after the generator is consumed
 * @example
 * pipe(
 *  [1,2,3],
 *  reverse()
 * ).toArray() // [3,2,1]
 */
export function reverse<ImperativeInput = never>() {
  return function* reverseGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    yield* [...generator].reverse();
  };
}
