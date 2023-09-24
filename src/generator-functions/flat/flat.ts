import { type OperatorGenerator } from "../../types";

export function* flat<Input, Depth extends number = 1>(
  generator: OperatorGenerator<Input>,
  depth?: Depth,
): OperatorGenerator<FlatArray<Input[], Depth>> {
  depth = depth ?? (1 as Depth);
  for (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}
