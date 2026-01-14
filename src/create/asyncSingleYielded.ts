import { type YieldedAsyncProvider, type AsyncSingleYielded } from "../types";
import { firstAsync } from "../consumers/first";
import { _internalY } from "../utils";
import { consumeAsync } from "../consumers/consume";
import {
  findAsync,
  flatAsync,
  flatMapAsync,
  mapAsync,
  tapAsync,
} from "../generators";
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";
import { liftAsync } from "../generators/misc/lift";

const stringTag = "SingleAsyncYielded";
export function asyncSingleYielded<TInput, TDefault>(
  provider: YieldedAsyncProvider<Awaited<TInput>>,
  getDefault: () => TDefault,
): AsyncSingleYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return {
        collect(signal?: AbortSignal) {
          return firstAsync(provider, getDefault, signal);
        },
      };
    },
    tap(callback) {
      return asyncSingleYielded(tapAsync(provider, callback), getDefault);
    },
    lift(middleware) {
      return asyncIterableAYielded(liftAsync(provider, middleware));
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return asyncSingleYielded(
        findAsync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return asyncIterableAYielded(flatAsync(provider, depth));
    },
    flatMap(callback) {
      return asyncIterableAYielded(flatMapAsync(provider, callback));
    },
    map(mapper) {
      return asyncSingleYielded(
        mapAsync(provider, mapper),
        _internalY.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return firstAsync(provider, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync(provider, signal);
    },
    [Symbol.toStringTag]: stringTag,
  };
}
