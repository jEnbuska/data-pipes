import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChanged<TInput>(
  source: ProviderFunction<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): ProviderFunction<TInput> {
  return function* distinctUntilChangedGenerator() {
    let first = true;
    let previous: TInput;
    using generator = InternalStreamless.disposable(source);
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
  source: AsyncProviderFunction<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): AsyncProviderFunction<TInput> {
  return async function* distinctUntilChangedAsyncGenerator() {
    let first = true;
    let previous: TInput;
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}
