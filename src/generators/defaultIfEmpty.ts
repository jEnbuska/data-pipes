import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../types.ts";

/**
 * yields the default value if the generator does not produce any items
 * @example
 * pipe(
 *  [1,2,3],
 *  filter(it => it > 3)
 *  defaultIfEmpty(0)
 * ).first() // 0
 */
export function defaultIfEmpty<Default, ImperativeTInput = never>(
  defaultValue: Default,
) {
  return function* defaultIfEmptyGenerator<TInput = ImperativeTInput>(
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

export function defaultIfEmptyAsync<Default, ImperativeTInput = never>(
  defaultValue: Default,
) {
  return async function* defaultIfEmptyAsyncGenerator<
    TInput = ImperativeTInput,
  >(
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
