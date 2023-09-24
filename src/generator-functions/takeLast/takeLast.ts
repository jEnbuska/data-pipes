import { type ChainableGenerator } from "../../types";

export function* takeLast<Input>(
  generator: ChainableGenerator<Input>,
  count: number,
): ChainableGenerator<Input> {
  const array = [...generator];
  yield* array.slice(Math.max(array.length - count, 0));
}
