import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function filter<TInput, TOutput extends TInput = TInput>(
  source: StreamlessProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): StreamlessProvider<TOutput>;
export function filter<TInput>(
  source: StreamlessProvider<TInput>,
  predicate: (next: TInput) => any,
): StreamlessProvider<TInput>;
export function filter(
  source: StreamlessProvider<unknown>,
  predicate: (next: unknown) => unknown,
): StreamlessProvider<unknown> {
  return function* filterGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): AsyncStreamlessProvider<TOutput>;
export function filterAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => any,
): AsyncStreamlessProvider<TInput>;
export function filterAsync(
  source: AsyncStreamlessProvider<unknown>,
  predicate: (next: unknown) => any,
): AsyncStreamlessProvider<unknown> {
  return async function* filterAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}
