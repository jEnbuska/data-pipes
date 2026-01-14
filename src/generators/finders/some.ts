import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function someSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<boolean> {
  return function* someSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
export function someAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<boolean> {
  return async function* someAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
