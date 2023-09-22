import { OperatorGenerator } from "../types.ts";

export function toGenerator<T>(
  generator: OperatorGenerator<T>,
): Generator<T, void, void> {
  return generator(() => false);
}
