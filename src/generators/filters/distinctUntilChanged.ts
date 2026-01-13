import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChangedSync<TInput>(
  source: SyncStreamlessProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): SyncStreamlessProvider<TInput> {
  return function* distinctUntilChangedSyncGenerator() {
    let first = true;
    let previous: TInput;
    using generator = _internalStreamless.disposable(source);
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
): AsyncStreamlessProvider<Awaited<TInput>> {
  return async function* distinctUntilChangedAsyncGenerator() {
    let first = true;
    let previous: TInput;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}
