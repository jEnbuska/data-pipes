import { type ChainableGenerator } from "../../types";

export function* flat<Input, Depth extends number = 1>(
  generator: ChainableGenerator<Input>,
  depth?: Depth,
): ChainableGenerator<FlatArray<Input[], Depth>> {
  depth = depth ?? (1 as Depth);
  for (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}
