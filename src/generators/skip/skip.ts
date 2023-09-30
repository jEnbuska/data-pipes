import { type GeneratorProvider } from "../../types";

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
