import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function countBySync<TInput>(
  source: SyncStreamlessProvider<TInput>,
  mapper: (next: TInput) => number,
): SyncStreamlessProvider<number> {
  return function* countSyncByGenerator() {
    let acc = 0;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  mapper: (next: TInput) => number,
): AsyncStreamlessProvider<number> {
  return async function* countByAsyncGenerator() {
    let acc = 0;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
