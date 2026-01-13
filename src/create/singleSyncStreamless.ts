import type { SingleSyncStreamless, SyncStreamlessProvider } from "../types";
import {
  findSync,
  flatSync,
  flatMapSync,
  mapSync,
  tapSync,
  resolve,
} from "../generators";
import { _internalStreamless } from "../utils";
import { firstSync } from "../consumers/first";
import { consumeSync } from "../consumers/consume";
import { iterableSyncStreamless } from "./iterableSyncStreamless";
import { singleAsyncStreamless } from "./singleAsyncStreamless";

export function singleSyncStreamless<TInput, TDefault>(
  source: SyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
): SingleSyncStreamless<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return singleSyncStreamless(source, getDefault);
    },
    tap(callback) {
      return singleSyncStreamless(tapSync(source, callback), getDefault);
    },
    lift(middleware) {
      return iterableSyncStreamless(middleware(source));
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncStreamless(
        findSync(source, predicate),
        _internalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncStreamless(flatSync(source, depth));
    },
    flatMap(callback) {
      return iterableSyncStreamless(flatMapSync(source, callback));
    },
    map(mapper) {
      return singleSyncStreamless(
        mapSync(source, mapper),
        _internalStreamless.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return firstSync<TInput, TDefault>(source, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync<TInput>(source, signal);
    },
    [Symbol.toStringTag]: "SingleSyncStreamless",
    resolve() {
      return singleAsyncStreamless(
        resolve(source),
        _internalStreamless.getUndefined,
      );
    },
  };
}
