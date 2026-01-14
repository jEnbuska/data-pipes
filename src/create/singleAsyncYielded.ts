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
  source: AsyncYieldedProvider<Awaited<TInput>>,
  getDefault: () => TDefault,
): SingleAsyncYielded<TInput, TDefault> {
  return {
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return {
        collect(signal?: AbortSignal) {
          return firstAsync(source, getDefault, signal);
        },
      };
    },
    tap(callback) {
      return singleAsyncYielded(tapAsync(source, callback), getDefault);
    },
    lift(middleware) {
      return iterableAsyncYielded(liftAsync(source, middleware));
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return singleAsyncYielded(
        findAsync(source, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return iterableAsyncYielded(flatAsync(source, depth));
    },
    flatMap(callback) {
      return iterableAsyncYielded(flatMapAsync(source, callback));
    },
    map(mapper) {
      return singleAsyncYielded(
        mapAsync(source, mapper),
        _internalY.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return firstAsync(source, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync(source, signal);
    },
    [Symbol.toStringTag]: stringTag,
  };
}
