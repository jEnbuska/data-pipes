import {
  type AsyncGeneratorMiddleware,
  type GeneratorMiddleware,
} from "../types.ts";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

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
