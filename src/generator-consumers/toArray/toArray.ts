import { type OperatorGenerator } from "../../types.ts";

export function toArray<T>(generator: OperatorGenerator<T>) {
  return [...generator];
}
