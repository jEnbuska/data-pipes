import { type GeneratorMiddleware } from "../../types";

/**
 * takes each item produced by the generator and maps it to a number using the callback.
 * Finally it yields the item with the lowest number to the next operation.
 *
 * @example
 * pipe(
 *  [2,1,3,4],
 *  min(n => n)
 * ).first() // 1
 */
export function min<Input>(
  callback: (next: Input) => number,
): GeneratorMiddleware<Input> {
  return function* minGenerator(generator) {
    let currentMin: undefined | number;
    let current: undefined | Input;
    for (const next of generator) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) return;
    yield current as Input;
  };
}
