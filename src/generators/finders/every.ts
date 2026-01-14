import { getDisposableGenerator, getDisposableAsyncGenerator } from "index";
import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";

export function everySync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<boolean> {
  return function* everySyncGenerator(signal) {
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
export function everyAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<boolean> {
  return async function* everyAsyncGenerator(signal) {
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
