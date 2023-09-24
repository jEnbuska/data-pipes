import { type OperatorGenerator } from "../../types";

export function* reverse<Input>(
  generator: OperatorGenerator<Input>,
): OperatorGenerator<Input> {
  yield* [...generator].reverse();
}
