import {
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";
import { addReturnRootOnAbortListener } from "../utils.ts";
import { createResolvable } from "../resolvable.ts";

export function first() {
  return function firstConsumer<TInput>(
    generator: GeneratorProvider<TInput>,
  ): TInput | void {
    const result = generator.next();
    return result.value;
  };
}
export function firstAsync(
  source: GeneratorProvider<unknown> | AsyncGeneratorProvider<unknown>,
  signal?: AbortSignal,
) {
  return async function firstAsyncConsumer<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): Promise<TInput | void> {
    const resolvable = await createResolvable<TInput | void>();
    if (signal?.aborted) {
      void source.return();
    }
    addReturnRootOnAbortListener(signal, source);
    signal?.addEventListener("abort", () => resolvable.resolve());
    return Promise.race([
      resolvable.promise,
      generator.next().then((result) => result.value),
    ]);
  };
}
