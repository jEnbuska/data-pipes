import { type OperatorGenerator } from "../types.ts";

export function toSingle<T>(generator: OperatorGenerator<T>) {
  const result = generator().next();
  if (result.done) {
    throw new Error("No items in generator");
  }
  return result.value;
}
