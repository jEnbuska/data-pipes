import { type ChainableGenerator } from "../../types";

export function* reverse<Input>(
  generator: ChainableGenerator<Input>,
): ChainableGenerator<Input> {
  yield* [...generator].reverse();
}
