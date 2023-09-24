import { type ChainableGenerator } from "../../types";

export function* unflat<Input>(
  generator: ChainableGenerator<Input>,
): ChainableGenerator<Input[]> {
  yield [...generator];
}
