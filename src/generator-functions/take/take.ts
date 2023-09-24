import { type OperatorGenerator } from "../../types";

export function* take<Input>(
  generator: OperatorGenerator<Input>,
  count: number,
): OperatorGenerator<Input> {
  for (const next of generator) {
    if (count <= 0) {
      break;
    }
    count--;
    yield next;
  }
}
