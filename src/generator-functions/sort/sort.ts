import { type OperatorGenerator } from "../../types";

export function* sort<Input>(
  generator: OperatorGenerator<Input>,
  comparator?: (a: Input, b: Input) => number,
): OperatorGenerator<Input> {
  yield* [...generator].sort(comparator);
}
