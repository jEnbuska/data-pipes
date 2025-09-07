import { type GeneratorProvider, type GeneratorMiddleware } from "../../types";

/**
 * takes each item produced by the generator and maps it to a number using the callback.
 * Finally it yields the item with the highest number to the next operation.
 *
 * @example
 * pipe(
 *  [1,2,4,3],
 *  max(n => n)
 * ).first() // 4
 * */
export function max<TInput>(
  callback: (next: TInput) => number,
): GeneratorMiddleware<TInput> {
  return function* maxGenerator(generator) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    for (const next of generator) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) return;
    yield current as TInput;
  };
}

export function maxAsync<TInput>(callback: (next: TInput) => number) {
  return async function* maxGenerator(
    generator: GeneratorProvider<TInput, true>,
  ) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    for await (const next of generator) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) return;
    yield current as TInput;
  };
}
