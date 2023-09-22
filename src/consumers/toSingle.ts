import { type OperatorGenerator } from "../types.ts";

export function toSingle<T>(generator: OperatorGenerator<T>) {
  let done = false;
  const result = generator(() => done).next();
  done = true;
  if (result.done) {
    throw new Error("No items in generator");
  }
  return result.value;
}
