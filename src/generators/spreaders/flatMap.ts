import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* flatMapSync<TInput, TOutput>(
  generator: YieldedIterator<TInput>,
  flatMapper: (next: TInput, index: number) => TOutput | readonly TOutput[],
): YieldedIterator<TOutput> {
  let index = 0;
  for (const next of generator) {
    const out = flatMapper(next, index++);
    if (Array.isArray(out)) {
      yield* out as any;
    } else {
      yield out as TOutput;
    }
  }
}

export async function* flatMapAsync<TInput, TOutput>(
  generator: YieldedAsyncGenerator<TInput>,
  flatMapper: (
    next: TInput,
    index: number,
  ) => Promise<TOutput | readonly TOutput[]> | TOutput | readonly TOutput[],
): YieldedAsyncGenerator<TOutput> {
  let index = 0;
  for await (const next of generator) {
    const out = await flatMapper(next, index++);
    if (Array.isArray(out)) {
      yield* out as any;
    } else {
      yield out as TOutput;
    }
  }
}
