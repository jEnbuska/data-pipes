import { type OperatorGenerator } from "../../types.ts";

export function* flat<T, D extends number = 1>(
  generator: OperatorGenerator<T>,
  depth?: D,
): OperatorGenerator<FlatArray<T[], D>> {
  depth = depth ?? (1 as D);
  for (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}
