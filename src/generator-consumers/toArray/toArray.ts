import { type OperatorGenerator } from "../../types";

export function toArray<Input>(generator: OperatorGenerator<Input>) {
  return [...generator];
}
