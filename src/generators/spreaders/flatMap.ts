import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function flatMapSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): SyncYieldedProvider<TOutput> {
  return function* flatMapSyncGenerator() {
    using generator = _internalYielded.disposable(source);
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
  source: AsyncYieldedProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): AsyncYieldedProvider<Awaited<TOutput>> {
  return async function* flatMapAsyncGenerator() {
    using generator = _internalYielded.disposable(source);
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
