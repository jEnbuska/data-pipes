import { type SingleSyncYielded, type SyncYieldedProvider } from "../types";
import {
  findSync,
  flatSync,
  flatMapSync,
  mapSync,
  tapSync,
  resolve,
} from "../generators";
import { firstSync } from "../consumers/first";
import { consumeSync } from "../consumers/consume";
import { iterableSyncYielded } from "./iterableSyncYielded";
import { singleAsyncYielded } from "./singleAsyncYielded";
import { liftSync } from "../generators/misc/lift";
import { _internalY } from "../utils";

export function singleSyncYielded<TInput, TDefault>(
  source: SyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
): SingleSyncYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return {
        collect(signal?: AbortSignal) {
          return firstSync(source, getDefault, signal);
        },
      };
    },
    tap(callback) {
      return singleSyncYielded(tapSync(source, callback), getDefault);
    },
    lift(middleware) {
      return iterableSyncYielded(liftSync(source, middleware));
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncYielded(
        findSync(source, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncYielded(flatSync(source, depth));
    },
    flatMap(callback) {
      return iterableSyncYielded(flatMapSync(source, callback));
    },
    map(mapper) {
      return singleSyncYielded(
        mapSync(source, mapper),
        _internalY.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return firstSync(source, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync(source, signal);
    },
    [Symbol.toStringTag]: "SingleSyncYielded",
    resolve() {
      return singleAsyncYielded(resolve(source), _internalY.getUndefined);
    },
  };
}
