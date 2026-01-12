import {
  type AsyncStreamlessProvider,
  type StreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function takeWhile<TInput>(
  source: StreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): StreamlessProvider<TInput> {
  return function* takeWhileAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
export function takeWhileAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<TInput> {
  return async function* takeWhileAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
