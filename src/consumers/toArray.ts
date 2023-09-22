import { type OperatorGenerator } from "../types.ts";

export function toArray<T>(generator: OperatorGenerator<T>) {
  const array: T[] = [];
  for (const next of generator(() => false)) {
    array.push(next);
  }
  return array;
}
