import {
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

/**
 * yields the default value if the generator does not produce any items
 * @example
 * source([1,2,3].filter(it => it > 3).defaultIfEmpty(0).first() // 0
 */
export function defaultIfEmpty<Default>(defaultValue: Default) {
  return function* defaultIfEmptyGenerator<TInput>(
    generator: GeneratorProvider<TInput>,
  ) {
    let empty = true;
    for (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield defaultValue;
    }
  };
}

export function defaultIfEmptyAsync<Default>(defaultValue: Default) {
  return async function* defaultIfEmptyAsyncGenerator<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorProvider<TInput | Default> {
    let empty = true;
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield defaultValue;
    }
  };
}
