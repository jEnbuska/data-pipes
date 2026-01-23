import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function flatMapSync<TInput, TOutput>(
  flatMapper: (next: TInput, index: number) => TOutput | readonly TOutput[],
): YieldedSyncMiddleware<TInput, TOutput> {
  return function* flatMapSyncResolver(generator) {
    let index = 0;
    for (const next of generator) {
      const out = flatMapper(next, index++);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}

export function flatMapAsync<TInput, TOutput>(
  flatMapper: (
    next: TInput,
    index: number,
  ) => Promise<TOutput | readonly TOutput[]> | TOutput | readonly TOutput[],
): YieldedAsyncMiddleware<TInput, TOutput> {
  return async function* flatMapAsyncResolver(generator) {
    let index = 0;
    for await (const next of generator) {
      const out = await flatMapper(next, index++);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}
