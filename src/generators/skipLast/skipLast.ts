import { type GeneratorProvider } from "../../types";

/**
 * skips the last `count` items produced by the generator and yields the rest to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  skipLast(2)
 * ).toArray() // [1]
 */
export function skipLast<ImperativeInput = never>(count: number) {
  return function* skipLastGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    const buffer: Input[] = [];
    let skipped = 0;
    for (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}
