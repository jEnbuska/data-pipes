import { type OperatorGenerator } from "../../types.ts";

export function* skip<T>(
  generator: OperatorGenerator<T>,
  count: number,
): OperatorGenerator<T> {
  let skipped = 0;
  for (const next of generator) {
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield next;
  }
}
