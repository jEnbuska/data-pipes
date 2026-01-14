import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function mapSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): SyncYieldedProvider<TOutput> {
  return function* mapSyncGenerator(signal) {
    using generator = getDisposableGenerator(source, signal);
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
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
