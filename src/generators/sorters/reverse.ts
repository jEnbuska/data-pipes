import { type AsyncPipeSource, type PipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function reverse<TInput>(
  source: PipeSource<TInput>,
): PipeSource<TInput, TInput[]> {
  return function* reverseGenerator() {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

export function reverseAsync<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncPipeSource<TInput, TInput[]> {
  return async function* reverseAsyncGenerator(): AsyncGenerator<
    TInput,
    TInput[],
    undefined & void
  > {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}
