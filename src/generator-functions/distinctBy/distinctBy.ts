import { type OperatorGenerator } from "../../types";

export function* distinctBy<Input, Value>(
  generator: OperatorGenerator<Input>,
  selector: (next: Input) => Value,
): OperatorGenerator<Input> {
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
