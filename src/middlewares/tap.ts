import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export interface IYieldedTap<T, TAsync extends boolean> {}

export function* tapSync<T>(
  generator: YieldedIterator<T>,
  consumer: (next: T) => unknown,
): YieldedIterator<T> {
  for (const next of generator) {
    consumer(next);
    yield next;
  }
}

export async function* tapAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  consumer: (next: T) => unknown,
): YieldedAsyncGenerator<T> {
  for await (const next of generator) {
    consumer(next);
    yield next;
  }
}
