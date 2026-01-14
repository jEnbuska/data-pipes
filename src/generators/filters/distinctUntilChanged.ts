import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChangedSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): SyncYieldedProvider<TInput> {
  return function* distinctUntilChangedSyncGenerator(signal) {
    let first = true;
    let previous: TInput;
    using generator = getDisposableGenerator(source, signal);
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
  return async function* distinctUntilChangedAsyncGenerator(signal) {
    let first = true;
    let previous: TInput;
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}
