import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function tap<TInput>(
  source: SyncStreamlessProvider<TInput>,
  consumer: (next: TInput) => unknown,
): SyncStreamlessProvider<TInput> {
  return function* tapGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function tapAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  consumer: (next: TInput) => unknown,
): AsyncStreamlessProvider<Awaited<TInput>> {
  return async function* tapAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
