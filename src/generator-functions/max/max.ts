import { type ChainableGenerator } from "../../types";

export function* max<Input>(
  generator: ChainableGenerator<Input>,
  callback: (next: Input) => number,
) {
  let currentMax: undefined | number;
  let current: undefined | Input;
  for (const next of generator) {
    const value = callback(next);
    if (currentMax === undefined || value > currentMax) {
      current = next;
      currentMax = value;
    }
  }
  if (currentMax === undefined) return;
  yield current as Input;
}
