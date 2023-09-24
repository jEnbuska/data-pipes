import { type OperatorGenerator } from "../../types.ts";

export function* sort<T>(
  generator: OperatorGenerator<T>,
  comparator?: (a: T, b: T) => number,
): OperatorGenerator<T> {
  yield* [...generator].sort(comparator);
}
