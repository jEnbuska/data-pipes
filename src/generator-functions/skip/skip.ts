import { type OperatorGenerator } from "../../types";

export function* skip<Input>(
  generator: OperatorGenerator<Input>,
  count: number,
): OperatorGenerator<Input> {
  let skipped = 0;
  for (const next of generator) {
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield next;
  }
}
