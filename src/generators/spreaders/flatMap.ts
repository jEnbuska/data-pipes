import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function flatMapSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): YieldedSyncProvider<TOutput> {
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
  provider: YieldedAsyncProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): YieldedAsyncProvider<Awaited<TOutput>> {
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
