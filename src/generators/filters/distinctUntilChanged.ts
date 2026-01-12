import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChanged<TInput>(
  source: StreamlessProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): StreamlessProvider<TInput> {
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
  source: AsyncStreamlessProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): AsyncStreamlessProvider<TInput> {
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
