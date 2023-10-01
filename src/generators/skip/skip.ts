import { type GeneratorProvider } from "../../types";

/**
 * skips the first `count` items produced by the generator and yields the rest to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  skip(2)
 * ).toArray() // [3]
 */
export function skip<ImperativeInput = never>(count: number) {
  return function* skipGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    let skipped = 0;
    for (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
