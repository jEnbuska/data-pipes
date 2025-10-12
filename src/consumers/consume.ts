import {
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";
import { addReturnRootOnAbortListener, invoke } from "../utils.ts";
import { createResolvable } from "../resolvable.ts";

export function consume() {
  return function consumer(generator: GeneratorProvider<unknown>): void {
    for (const _ of generator) {
      /* iterate until done */
    }
  };
}

export function consumeAsync(
  source: GeneratorProvider<unknown> | AsyncGeneratorProvider<unknown>,
  signal?: AbortSignal,
) {
  return async function consumerAsync(
    generator: AsyncGeneratorProvider<unknown>,
  ): Promise<void> {
    const resolvable = await createResolvable<void>();
    if (signal?.aborted) {
      void source.return();
      return;
    }
    addReturnRootOnAbortListener(signal, source);
    signal?.addEventListener("abort", () => resolvable.resolve());
    return Promise.race([
      resolvable.promise,
      invoke(async function () {
        for await (const _ of generator) {
          if (signal?.aborted) {
            return resolvable.promise;
          }
        }
      }),
    ]);
  };
}
