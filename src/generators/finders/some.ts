import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function someSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<boolean> {
  return function* someSyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
export function someAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<boolean> {
  return async function* someAsyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
