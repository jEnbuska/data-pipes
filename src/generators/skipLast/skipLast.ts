import { type GeneratorProvider } from "../../types";

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
