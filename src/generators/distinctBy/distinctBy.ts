import { type GeneratorMiddleware } from "../../types";

export function distinctBy<Input, Value>(
  selector: (next: Input) => Value,
): GeneratorMiddleware<Input> {
  return function* distinctByGenerator(generator) {
    const set = new Set<Value>();
    for (const next of generator) {
      const key = selector(next);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield next;
    }
  };
}
