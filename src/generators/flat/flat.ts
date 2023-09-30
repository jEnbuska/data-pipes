import { type GeneratorProvider } from "../../types";

export function flat<Depth extends number = 1, ImperativeInput = never>(
  depth?: Depth,
) {
  return function* flatGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<FlatArray<Input[], Depth>> {
    depth = depth ?? (1 as Depth);
    for (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next as any;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
