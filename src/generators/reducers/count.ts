import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function countSync<TInput>(
  source: SyncYieldedProvider<TInput>,
): SyncYieldedProvider<number> {
  return function* countSyncGenerator() {
    using generator = _internalYielded.disposable(source);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
): AsyncYieldedProvider<number> {
  return async function* countAsyncGenerator() {
    let count = 0;
    using generator = _internalYielded.disposable(source);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
