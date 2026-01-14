import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function mapSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): SyncYieldedProvider<TOutput> {
  return function* mapSyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  source: AsyncYieldedProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): AsyncYieldedProvider<Awaited<TOutput>> {
  return async function* mapAsyncGenerator() {
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
