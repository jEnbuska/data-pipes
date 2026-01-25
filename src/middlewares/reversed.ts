import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* reversedSync<T>(
  generator: YieldedIterator<T>,
): YieldedIterator<T> {
  const acc: T[] = [];
  for (const next of generator) {
    acc.unshift(next);
  }
  yield* acc;
}

export async function* reversedAsync<T>(
  generator: YieldedAsyncGenerator<T>,
): YieldedAsyncGenerator<T> {
  const acc: T[] = [];
  for await (const next of generator) {
    acc.unshift(next);
  }
  yield* acc;
}
