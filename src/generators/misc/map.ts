import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* mapSync<TInput, TOutput>(
  generator: YieldedSyncGenerator<TInput>,
  mapper: (next: TInput) => TOutput,
): YieldedSyncGenerator<TOutput> {
  yield* generator.map(mapper);
}

export async function* mapAsync<TInput, TOutput>(
  generator: YieldedAsyncGenerator<TInput>,
  mapper: (next: TInput) => Promise<TOutput> | TOutput,
): YieldedAsyncGenerator<TOutput> {
  for await (const next of generator) {
    yield mapper(next);
  }
}
