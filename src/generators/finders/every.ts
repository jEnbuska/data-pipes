import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function every<TInput>(
  source: StreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): StreamlessProvider<boolean> {
  return function* everyGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
export function everyAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<boolean> {
  return async function* everyAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
