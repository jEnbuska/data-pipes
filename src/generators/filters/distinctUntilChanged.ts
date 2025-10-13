import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChanged<TInput>(
  source: PipeSource<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): PipeSource<TInput> {
  return function* distinctUntilChangedGenerator() {
    let first = true;
    let previous: TInput;
    using generator = disposable(source);
    for (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}

export function distinctUntilChangedAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): AsyncPipeSource<TInput> {
  return async function* distinctUntilChangedAsyncGenerator() {
    let first = true;
    let previous: TInput;
    using generator = disposable(source);
    for await (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}
