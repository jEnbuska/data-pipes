import { type OperatorGenerator } from "../../types.ts";

export function* distinctBy<T, R>(
  generator: OperatorGenerator<T>,
  selector: (next: T) => R,
): OperatorGenerator<T> {
  const set = new Set<R>();
  for (const next of generator) {
    const key = selector(next);
    if (set.has(key)) {
      continue;
    }
    set.add(key);
    yield next;
  }
}
