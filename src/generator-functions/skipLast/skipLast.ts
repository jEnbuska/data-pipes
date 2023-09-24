import { type ChainableGenerator } from "../../types";

export function* skipLast<Input>(
  generator: ChainableGenerator<Input>,
  count: number,
): ChainableGenerator<Input> {
  const buffer: Input[] = [];
  let skipped = 0;
  for (const next of generator) {
    buffer.push(next);
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield buffer.shift()!;
  }
}
