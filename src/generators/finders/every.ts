import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function everySync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<boolean> {
  return function* everySyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
export function everyAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<boolean> {
  return async function* everyAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
