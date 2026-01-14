import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function flatMapSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): YieldedSyncProvider<TOutput> {
  return function* flatMapSyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
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
