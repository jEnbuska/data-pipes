import { type GeneratorProvider } from "../../types";

/**
 * yields the first `count` items produced by the generator to the next and ignores the rest.
 * @example
 * pipe(
 *  [1,2,3],
 *  take(2)
 * ).toArray() // [1,2]
 */
export function take<ImperativeInput = never>(count: number) {
  return function* takeGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    for (const next of generator) {
      if (count <= 0) {
        break;
      }
      count--;
      yield next;
    }
  };
}
