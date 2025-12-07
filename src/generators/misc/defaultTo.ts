import {
  type AsyncProvider,
  type PipeSource,
  type AsyncPipeSource,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

/**
 * yields the default value if the generator does not produce any items
 * @example
 * source([1,2,3].filter(it => it > 3).defaultTo(0).first() // 0
 */
export function defaultTo<TInput, TDefault>(
  source: PipeSource<TInput>,
  getDefault: () => TDefault,
): PipeSource<TInput | TDefault> {
  return function* defaultToGenerator() {
    let empty = true;
    using generator = disposable(source);
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
  source: AsyncPipeSource<TInput>,
  getDefault: () => TDefault,
): AsyncPipeSource<TInput | TDefault> {
  return async function* defaultToAsyncGenerator(): AsyncProvider<
    TInput | TDefault,
    void
  > {
    let empty = true;
    using generator = disposable(source);
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}
