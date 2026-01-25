import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function toReversedSync<T>(generator: YieldedIterator<T>): T[] {
  const acc: T[] = [];
  for (const next of generator) {
    acc.unshift(next);
  }
  return acc;
}

export async function toReversedAsync<T>(
  generator: YieldedAsyncGenerator<T>,
): Promise<T[]> {
  const acc: T[] = [];

  for await (const next of generator) {
    acc.unshift(next);
  }
  return acc;
}
