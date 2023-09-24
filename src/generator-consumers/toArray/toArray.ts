import { type ChainableGenerator } from "../../types";

export function toArray<Input>(generator: ChainableGenerator<Input>) {
  return [...generator];
}
