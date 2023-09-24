import { type ChainableGenerator } from "../../types";

export function* distinctBy<Input, Value>(
  generator: ChainableGenerator<Input>,
  selector: (next: Input) => Value,
): ChainableGenerator<Input> {
  const set = new Set<Value>();
  for (const next of generator) {
    const key = selector(next);
    if (set.has(key)) {
      continue;
    }
    set.add(key);
    yield next;
  }
}
