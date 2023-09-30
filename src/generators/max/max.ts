import { type GeneratorMiddleware } from "../../types";

export function max<Input>(
  callback: (next: Input) => number,
): GeneratorMiddleware<Input> {
  return function* maxGenerator(generator) {
    let currentMax: undefined | number;
    let current: undefined | Input;
    for (const next of generator) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) return;
    yield current as Input;
  };
}
