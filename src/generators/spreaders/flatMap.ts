import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function flatMapSync<TInput, TOutput>(
  provider: SyncYieldedProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): SyncYieldedProvider<TOutput> {
  return function* flatMapSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}

export function flatMapAsync<TInput, TOutput>(
  provider: AsyncYieldedProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): AsyncYieldedProvider<Awaited<TOutput>> {
  return async function* flatMapAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}
