import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* takeSync<T>(
  generator: YieldedIterator<T>,
  count: number,
): YieldedIterator<T> {
  if (count <= 0) return;
  for (const next of generator) {
    yield next;
    if (!--count) return;
  }
}

export async function* takeAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  count: number,
): YieldedAsyncGenerator<T> {
  if (count <= 0) return;
  for await (const next of generator) {
    yield next;
    if (!--count) return;
  }
}
