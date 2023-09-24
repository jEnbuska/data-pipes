import { type ChainableGenerator } from "../../types";

export function* sort<Input>(
  generator: ChainableGenerator<Input>,
  comparator?: (a: Input, b: Input) => number,
): ChainableGenerator<Input> {
  yield* [...generator].sort(comparator);
}
