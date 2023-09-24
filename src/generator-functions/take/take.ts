import { type OperatorGenerator } from "../../types.ts";

export function* take<T>(
  generator: OperatorGenerator<T>,
  count: number,
): OperatorGenerator<T> {
  for (const next of generator) {
    if (count <= 0) {
      break;
    }
    count--;
    yield next;
  }
}
