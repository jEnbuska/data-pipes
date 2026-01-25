import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* tapSync<TInput>(
  generator: YieldedIterator<TInput>,
  consumer: (next: TInput) => unknown,
): YieldedIterator<TInput> {
  for (const next of generator) {
    consumer(next);
    yield next;
  }
}

export async function* tapAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  consumer: (next: TInput) => unknown,
): YieldedAsyncGenerator<TInput> {
  for await (const next of generator) {
    consumer(next);
    yield next;
  }
}
