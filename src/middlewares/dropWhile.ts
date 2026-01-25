import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* dropWhileSync<T>(
  generator: YieldedIterator<T>,
  predicate: (next: T) => boolean,
): YieldedIterator<T> {
  for (const next of generator) {
    if (predicate(next)) continue;
    yield next;
    break;
  }
  for (const next of generator) {
    yield next;
  }
}

export async function* dropWhileAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (next: T) => PromiseOrNot<boolean>,
): YieldedAsyncGenerator<T> {
  for await (const next of generator) {
    if (await predicate(next)) continue;
    yield next;
    break;
  }
  for await (const next of generator) {
    yield next;
  }
}
