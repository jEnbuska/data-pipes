import { type ChainableGenerator } from "../../types";

export function* skip<Input>(
  generator: ChainableGenerator<Input>,
  count: number,
): ChainableGenerator<Input> {
  let skipped = 0;
  for (const next of generator) {
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield next;
  }
}
