import { type ChainableGenerator } from "../../types";

export function* count<Input>(
  generator: ChainableGenerator<Input>,
): ChainableGenerator<number> {
  yield [...generator].length;
}
