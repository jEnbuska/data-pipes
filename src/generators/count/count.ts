import { type GeneratorProvider } from "../../types";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  count()
 * ).first() // 3
 */
export function count<ImperativeInput = never>() {
  return function* countGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<number> {
    yield [...generator].length;
  };
}
