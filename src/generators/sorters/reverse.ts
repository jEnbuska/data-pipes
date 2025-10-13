import { type AsyncPipeSource, type PipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function reverse<TInput>(
  source: PipeSource<TInput>,
): PipeSource<TInput> {
  return function* reverseGenerator() {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
  };
}

export function reverseAsync<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncPipeSource<TInput> {
  return async function* reverseAsyncGenerator(): AsyncGenerator<
    TInput,
    void,
    undefined & void
  > {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
  };
}
