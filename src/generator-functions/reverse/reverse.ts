import { type OperatorGenerator } from "../../types.ts";

export function* reverse<T>(
  generator: OperatorGenerator<T>,
): OperatorGenerator<T> {
  yield* [...generator].reverse();
}
