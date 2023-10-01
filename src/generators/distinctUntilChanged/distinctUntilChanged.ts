import { type GeneratorMiddleware } from "../../types";

const defaultCompare = <Input>(a: Input, b: Input) => a === b;

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
export function distinctUntilChanged<Input>(
  compare: (previous: Input, current: Input) => boolean = defaultCompare,
): GeneratorMiddleware<Input> {
  return function* distinctUntilChangedGenerator(generator) {
    let first = true;
    let previous: Input;
    for (const current of generator) {
      if (first || !compare(previous!, current)) {
        previous = current;
        yield current;
        first = false;
      }
    }
  };
}
