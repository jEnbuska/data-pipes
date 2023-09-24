import { type ChainableGenerator } from "../../types";

export function toGenerator<Input>(
  generator: ChainableGenerator<Input>,
): Generator<Input, void, void> {
  return generator;
}
