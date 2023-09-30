import { type GeneratorMiddleware } from "../../types";

const defaultCompare = <Input>(a: Input, b: Input) => a === b;

export function distinctUntilChanged<Input>(
  isEqual: (previous: Input, current: Input) => boolean = defaultCompare,
): GeneratorMiddleware<Input> {
  return function* distinctUntilChangedGenerator(generator) {
    let first = true;
    let previous: Input;
    for (const current of generator) {
      if (first || !isEqual(previous!, current)) {
        previous = current;
        yield current;
        first = false;
      }
    }
  };
}
