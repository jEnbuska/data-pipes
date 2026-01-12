import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function find<TInput>(
  source: StreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): StreamlessProvider<TInput> {
  return function* findGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}

export function findAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<TInput> {
  return async function* findAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}
