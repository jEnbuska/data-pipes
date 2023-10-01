import { type GeneratorProvider } from "../../types";

/**
 * takes the last `count` items produced by the generator and yields them to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  takeLast(2)
 * ).toArray() // [2,3]
 */
export function takeLast<ImperativeInput = never>(count: number) {
  return function* takeLastGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    const array = [...generator];
    yield* array.slice(Math.max(array.length - count, 0));
  };
}
