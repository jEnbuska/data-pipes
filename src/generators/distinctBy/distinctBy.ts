import { type GeneratorMiddleware } from "../../types";

/**
 * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
 *
 * @example
 * pipe(
 *  [1,2,3,4],
 *  distinctBy(n => n % 2)
 * ).toArray() // [1,2]
 */
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
