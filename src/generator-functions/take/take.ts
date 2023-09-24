import { type ChainableGenerator } from "../../types";

export function* take<Input>(
  generator: ChainableGenerator<Input>,
  count: number,
): ChainableGenerator<Input> {
  for (const next of generator) {
    if (count <= 0) {
      break;
    }
    count--;
    yield next;
  }
}
