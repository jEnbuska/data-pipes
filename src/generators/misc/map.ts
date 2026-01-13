import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function map<TInput, TOutput>(
  source: SyncStreamlessProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): SyncStreamlessProvider<TOutput> {
  return function* mapGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  source: AsyncStreamlessProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): AsyncStreamlessProvider<TOutput> {
  return async function* mapAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
