import { type GeneratorMiddleware } from "../../types";

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
