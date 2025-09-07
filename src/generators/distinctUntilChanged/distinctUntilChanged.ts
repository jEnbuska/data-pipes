import {
  type GeneratorMiddleware,
  type AsyncGeneratorMiddleware,
} from "../../types";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

/**
 * filters out items produced by the generator that are equal to the previous item by the compare function.
 * If no compare function is provided, the strict equality operator is used.
 * @example
 * pipe(
 *  [1,2,2,2,3],
 *  distinctUntilChanged()
 * ).toArray() // [1,2,3]
 *
 * @example
 * pipe(
 *  [1, 2, 5, 8, 3],
 *  distinctUntilChanged((previous, current) => previous % 3 === current % 3)
 * ).toArray() // [1,2,3]
 */
export function distinctUntilChanged<TInput>(
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): GeneratorMiddleware<TInput> {
  return function* distinctUntilChangedGenerator(generator) {
    let first = true;
    let previous: TInput;
    for (const current of generator) {
      if (first || !compare(previous!, current)) {
        previous = current;
        yield current;
        first = false;
      }
    }
  };
}

export function distinctUntilChangedAsync<TInput>(
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): AsyncGeneratorMiddleware<TInput> {
  return async function* distinctUntilChangedAsyncGenerator(generator) {
    let first = true;
    let previous: TInput;
    for await (const current of generator) {
      if (first || !compare(previous!, current)) {
        previous = current;
        yield current;
        first = false;
      }
    }
  };
}
