import {
  type AsyncStreamlessProvider,
  type SingleAsyncStreamless,
} from "../types";
import { firstAsync } from "../consumers/first";
import { _internalStreamless } from "../utils";
import { consumeAsync } from "../consumers/consume";
import {
  findAsync,
  flatAsync,
  flatMapAsync,
  mapAsync,
  tapAsync,
} from "../generators";
import { iterableAsyncStreamless } from "./iterableAsyncStreamless";

const stringTag = "SingleAsyncStreamless";
export function singleAsyncStreamless<TInput, TDefault>(
  source: AsyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
): SingleAsyncStreamless<TInput, TDefault> {
  return {
    defaultTo<TDefault>(
      getDefault: () => TDefault,
    ): SingleAsyncStreamless<TInput, TDefault> {
      return singleAsyncStreamless(source, getDefault);
    },
    tap(callback) {
      return singleAsyncStreamless(tapAsync(source, callback), getDefault);
    },
    lift(middleware) {
      return iterableAsyncStreamless(middleware(source));
    },
    find(predicate: (next: TInput) => boolean) {
      return singleAsyncStreamless(
        findAsync(source, predicate),
        _internalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return iterableAsyncStreamless(flatAsync(source, depth));
    },
    flatMap(callback) {
      return iterableAsyncStreamless(flatMapAsync(source, callback));
    },
    map(mapper) {
      return singleAsyncStreamless(
        mapAsync(source, mapper),
        _internalStreamless.getUndefined,
      );
    },
    collect(signal?: AbortSignal) {
      return firstAsync<TInput, TDefault>(source, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(source, signal);
    },
    [Symbol.toStringTag]: stringTag,
  };
}
