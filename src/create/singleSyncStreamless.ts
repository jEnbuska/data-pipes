import type { SingleSyncStreamless, SyncStreamlessProvider } from "../types";
import { find, flat, flatMap, map, tap, resolve } from "../generators";
import { _internalStreamless } from "../utils";
import { first } from "../consumers/first";
import { consume } from "../consumers/consume";
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
      return singleSyncStreamless(tap(source, callback), getDefault);
    },
    lift(middleware) {
      return iterableSyncStreamless(middleware(source));
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncStreamless(
        find(source, predicate),
        _internalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncStreamless(flat(source, depth));
    },
    flatMap(callback) {
      return iterableSyncStreamless(flatMap(source, callback));
    },
    map(mapper) {
      return singleSyncStreamless(
        map(source, mapper),
        _internalStreamless.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return first<TInput, TDefault>(source, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consume<TInput>(source, signal);
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
