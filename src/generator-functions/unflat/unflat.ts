import { type OperatorGenerator } from "../../types.ts";

export function* unflat<T>(
  generator: OperatorGenerator<T>,
): OperatorGenerator<T[]> {
  yield [...generator];
}
