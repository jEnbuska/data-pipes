import { type OperatorGenerator } from "../../types";

const defaultCompare = <Input>(a: Input, b: Input) => a === b;
export function* distinctUntilChanged<Input>(
  generator: OperatorGenerator<Input>,
  isEqual: (previous: Input, current: Input) => boolean = defaultCompare,
): OperatorGenerator<Input> {
  let first = true;
  let previous: Input;
  for (const current of generator) {
    if (first || !isEqual(previous!, current)) {
      previous = current;
      yield current;
      first = false;
    }
  }
}
