import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function takeWhileSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
  return function* takeWhileSyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
export function takeWhileAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* takeWhileAsyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
