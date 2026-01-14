import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChangedSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): SyncYieldedProvider<TInput> {
  return function* distinctUntilChangedSyncGenerator() {
    let first = true;
    let previous: TInput;
    using generator = _internalYielded.disposable(source);
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
  source: AsyncYieldedProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* distinctUntilChangedAsyncGenerator() {
    let first = true;
    let previous: TInput;
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}
