import { type YieldedSyncProvider, type SyncSingleYielded } from "../types";
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
import { syncIterableYielded } from "./syncIterableYielded.ts";
import { asyncSingleYielded } from "./asyncSingleYielded.ts";
import { liftSync } from "../generators/misc/lift";
import { _internalY } from "../utils";

export function syncSingleYielded<TInput, TDefault>(
  provider: YieldedSyncProvider<TInput>,
  getDefault: () => TDefault,
): SyncSingleYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return {
        collect(signal?: AbortSignal) {
          return firstSync(provider, getDefault, signal);
        },
      };
    },
    tap(callback) {
      return syncSingleYielded(tapSync(provider, callback), getDefault);
    },
    lift(middleware) {
      return syncIterableYielded(liftSync(provider, middleware));
    },
    find(predicate: (next: TInput) => boolean) {
      return syncSingleYielded(
        findSync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return syncIterableYielded(flatSync(provider, depth));
    },
    flatMap(callback) {
      return syncIterableYielded(flatMapSync(provider, callback));
    },
    map(mapper) {
      return syncSingleYielded(
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
      return asyncSingleYielded(resolve(provider), _internalY.getUndefined);
    },
  };
}
