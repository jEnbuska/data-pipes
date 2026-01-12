import {
  type AsyncStreamlessProvider,
  type StreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function reverse<TInput>(
  source: StreamlessProvider<TInput>,
): StreamlessProvider<TInput, TInput[]> {
  return function* reverseGenerator() {
    const acc: TInput[] = [];
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

export function reverseAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
): AsyncStreamlessProvider<TInput, TInput[]> {
  return async function* reverseAsyncGenerator(): AsyncGenerator<
    TInput,
    TInput[],
    undefined & void
  > {
    const acc: TInput[] = [];
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}
