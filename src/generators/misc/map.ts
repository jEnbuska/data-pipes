import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function mapSync<TInput, TOutput>(
  mapper: (next: TInput) => TOutput,
): YieldedSyncMiddleware<TInput, TOutput> {
  return function* mapSyncResolver(generator) {
    yield* generator.map(mapper);
  };
}

export function mapAsync<TInput, TOutput>(
  mapper: (next: TInput) => Promise<TOutput> | TOutput,
): YieldedAsyncMiddleware<TInput, TOutput> {
  return async function* mapAsyncResolver(generator) {
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
