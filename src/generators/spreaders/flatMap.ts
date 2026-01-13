import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function flatMap<TInput, TOutput>(
  source: SyncStreamlessProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): SyncStreamlessProvider<TOutput> {
  return function* flatMapGenerator() {
    using generator = _internalStreamless.disposable(source);
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
  source: AsyncStreamlessProvider<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): AsyncStreamlessProvider<Awaited<TOutput>> {
  return async function* flatMapAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
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
