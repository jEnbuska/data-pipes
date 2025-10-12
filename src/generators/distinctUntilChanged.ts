import { type PipeSource, type AsyncPipeSource } from "../types.ts";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChanged<TInput>(
  source: PipeSource<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): PipeSource<TInput> {
  return function* distinctUntilChangedGenerator(signal) {
    let first = true;
    let previous: TInput;
    for (const current of source(signal)) {
      if (first || !compare(previous!, current)) {
        previous = current;
        yield current;
        first = false;
      }
    }
  };
}

export function distinctUntilChangedAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): AsyncPipeSource<TInput> {
  return async function* distinctUntilChangedAsyncGenerator(signal) {
    let first = true;
    let previous: TInput;
    for await (const current of source(signal)) {
      if (first || !compare(previous!, current)) {
        previous = current;
        yield current;
        first = false;
      }
    }
  };
}
