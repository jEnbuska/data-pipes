import {
  type AsyncStreamlessProvider,
  type SingleAsyncStreamless,
  type StreamlessLiftMiddleware,
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
  source: AsyncStreamlessProvider<Awaited<TInput>>,
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
    lift<TOutput>(
      middleware: StreamlessLiftMiddleware<true, Awaited<TInput>, TOutput>,
    ) {
      return iterableAsyncStreamless<TOutput>(middleware(source));
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
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
      return firstAsync(source, getDefault, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync(source, signal);
    },
    [Symbol.toStringTag]: stringTag,
  };
}
