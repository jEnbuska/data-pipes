import { type OperatorGenerator } from "../../types";

export function* count<Input>(
  generator: OperatorGenerator<Input>,
): OperatorGenerator<number> {
  yield [...generator].length;
}
