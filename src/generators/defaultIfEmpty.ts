import {
  type AsyncGeneratorProvider,
  type PipeSource,
  type AsyncPipeSource,
} from "../types.ts";

/**
 * yields the default value if the generator does not produce any items
 * @example
 * source([1,2,3].filter(it => it > 3).defaultIfEmpty(0).first() // 0
 */
export function defaultIfEmpty<TInput, TDefault>(
  source: PipeSource<TInput>,
  defaultValue: TDefault,
): PipeSource<TInput | TDefault> {
  return function* defaultIfEmptyGenerator(signal) {
    let empty = true;
    for (const next of source(signal)) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield defaultValue;
    }
  };
}

export function defaultIfEmptyAsync<TInput, TDefault>(
  source: AsyncPipeSource<TInput>,
  defaultValue: TDefault,
): AsyncPipeSource<TInput | TDefault> {
  return async function* defaultIfEmptyAsyncGenerator(
    signal,
  ): AsyncGeneratorProvider<TInput | TDefault> {
    let empty = true;
    for await (const next of source(signal)) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield defaultValue;
    }
  };
}
