import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChangedSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): YieldedSyncProvider<TInput> {
  return function* distinctUntilChangedSyncGenerator(signal) {
    let first = true;
    let previous: TInput;
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* distinctUntilChangedAsyncGenerator(signal) {
    let first = true;
    let previous: TInput;
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (first || !compare(previous!, next)) {
        previous = next;
        yield next;
        first = false;
      }
    }
  };
}
