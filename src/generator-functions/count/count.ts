import { type OperatorGenerator } from "../../types.ts";

export function* count<T>(
  generator: OperatorGenerator<T>,
): OperatorGenerator<number> {
  yield [...generator].length;
}
