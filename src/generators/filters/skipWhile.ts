import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function skipWhile<TInput>(
  source: StreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): StreamlessProvider<TInput> {
  return function* skipWhileGenerator() {
    let skip = true;
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}

export function skipWhileAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<TInput> {
  return async function* skipWhileAsyncGenerator() {
    let skip = true;
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}
