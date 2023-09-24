import { type OperatorGenerator } from "../../types";

export function* unflat<Input>(
  generator: OperatorGenerator<Input>,
): OperatorGenerator<Input[]> {
  yield [...generator];
}
