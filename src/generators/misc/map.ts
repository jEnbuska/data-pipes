import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function mapSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): SyncYieldedProvider<TOutput> {
  return function* mapSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(source, signal);
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  source: AsyncYieldedProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): AsyncYieldedProvider<Awaited<TOutput>> {
  return async function* mapAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
