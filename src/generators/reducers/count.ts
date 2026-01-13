import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function countSync<TInput>(
  source: SyncStreamlessProvider<TInput>,
): SyncStreamlessProvider<number> {
  return function* countSyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
): AsyncStreamlessProvider<number> {
  return async function* countAsyncGenerator() {
    let count = 0;
    using generator = _internalStreamless.disposable(source);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
