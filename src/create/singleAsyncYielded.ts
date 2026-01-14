import { type AsyncYieldedProvider, type SingleAsyncYielded } from "../types";
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
import { iterableAsyncYielded } from "./iterableAsyncYielded";
import { liftAsync } from "../generators/misc/lift";

const stringTag = "SingleAsyncYielded";
export function singleAsyncYielded<TInput, TDefault>(
  provider: AsyncYieldedProvider<Awaited<TInput>>,
  getDefault: () => TDefault,
): SingleAsyncYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return {
        collect(signal?: AbortSignal) {
          return firstAsync(provider, getDefault, signal);
        },
      };
    },
    tap(callback) {
      return singleAsyncYielded(tapAsync(provider, callback), getDefault);
    },
    lift(middleware) {
      return iterableAsyncYielded(liftAsync(provider, middleware));
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return singleAsyncYielded(
        findAsync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return iterableAsyncYielded(flatAsync(provider, depth));
    },
    flatMap(callback) {
      return iterableAsyncYielded(flatMapAsync(provider, callback));
    },
    map(mapper) {
      return singleAsyncYielded(
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
