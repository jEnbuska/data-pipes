import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChangedSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): SyncYieldedProvider<TInput> {
  return function* distinctUntilChangedSyncGenerator(signal) {
    let first = true;
    let previous: TInput;
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
  provider: AsyncYieldedProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* distinctUntilChangedAsyncGenerator(signal) {
    let first = true;
    let previous: TInput;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}
