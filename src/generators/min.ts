import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
  type GeneratorProvider,
} from "../types.ts";

/**
 * takes each item produced by the generator and maps it to a number using the callback.
 * Finally it yields the item with the lowest number to the next operation.
 *
 * @example
 * source([2,1,3,4]).min(n => n).first() // 1
 */
export function min<TInput>(
  callback: (next: TInput) => number,
): GeneratorMiddleware<TInput> {
  return function* minGenerator(generator: GeneratorProvider<TInput>) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    for (const next of generator) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}
export function minAsync<TInput>(
  callback: (next: TInput) => number,
): AsyncGeneratorMiddleware<TInput> {
  return async function* minAsyncGenerator(generator) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    for await (const next of generator) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}
