import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function forEach<TInput>(
  source: StreamlessProvider<TInput>,
  consumer: (next: TInput) => unknown,
): StreamlessProvider<TInput> {
  return function* forEachGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function forEachAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  consumer: (next: TInput) => unknown,
): AsyncStreamlessProvider<TInput> {
  return async function* forEachAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
