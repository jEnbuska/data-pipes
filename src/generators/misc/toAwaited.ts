export function toAwaited<TInput>() {
  return async function* toAwaitedResolver(
    generator: Generator<TInput, unknown, undefined & void>,
  ): AsyncGenerator<TInput, void, undefined & void> {
    for (const next of generator) {
      yield next;
    }
  };
}
