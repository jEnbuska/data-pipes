import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export async function* awaited<T>(
  generator: YieldedIterator<T>,
): YieldedAsyncGenerator<Awaited<T>> {
  for (const next of generator) {
    yield next;
  }
}
