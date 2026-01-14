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
  provider: SyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
): SingleSyncYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return {
        collect(signal?: AbortSignal) {
          return firstSync(provider, getDefault, signal);
        },
      };
    },
    tap(callback) {
      return singleSyncYielded(tapSync(provider, callback), getDefault);
    },
    lift(middleware) {
      return iterableSyncYielded(liftSync(provider, middleware));
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncYielded(
        findSync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncYielded(flatSync(provider, depth));
    },
    flatMap(callback) {
      return iterableSyncYielded(flatMapSync(provider, callback));
    },
    map(mapper) {
      return singleSyncYielded(
        mapSync(provider, mapper),
        _internalY.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return firstSync(provider, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync(provider, signal);
    },
    [Symbol.toStringTag]: "SingleSyncYielded",
    resolve() {
      return singleAsyncYielded(resolve(provider), _internalY.getUndefined);
    },
  };
}
