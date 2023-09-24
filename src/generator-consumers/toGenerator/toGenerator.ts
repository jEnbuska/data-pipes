import { type OperatorGenerator } from "../../types";

export function toGenerator<Input>(
  generator: OperatorGenerator<Input>,
): Generator<Input, void, void> {
  return generator;
}
