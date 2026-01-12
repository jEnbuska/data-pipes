import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

/**
 * yields the default value if the generator does not produce any items
 * @example
 * streamless([1,2,3].filter(it => it > 3).defaultTo(0).first() // 0
 */
export function defaultTo<TInput, TDefault>(
  source: StreamlessProvider<TInput>,
  getDefault: () => TDefault,
): StreamlessProvider<TInput | TDefault> {
  return function* defaultToGenerator() {
    let empty = true;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}

export function defaultToAsync<TInput, TDefault>(
  source: AsyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
): AsyncStreamlessProvider<TInput | TDefault> {
  return async function* defaultToAsyncGenerator() {
    let empty = true;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}
