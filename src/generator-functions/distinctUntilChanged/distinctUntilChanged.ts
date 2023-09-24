import { type OperatorGenerator } from "../../types.ts";

const defaultCompare = <T>(a: T, b: T) => a === b;
export function* distinctUntilChanged<T>(
  generator: OperatorGenerator<T>,
  isEqual: (previous: T, current: T) => boolean = defaultCompare,
): OperatorGenerator<T> {
  let first = true;
  let previous: T;
  for (const current of generator) {
    if (first || !isEqual(previous!, current)) {
      previous = current;
      yield current;
      first = false;
    }
  }
}
