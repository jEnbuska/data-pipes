import {
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";
import { addReturnRootOnAbortListener, invoke } from "../utils.ts";
import { createResolvable } from "../resolvable.ts";

export function toArray() {
  return function toArrayConsumer<TInput>(
    generator: GeneratorProvider<TInput>,
  ): TInput[] {
    const acc: TInput[] = [];
    for (const next of generator) {
      acc.push(next);
    }
    return acc;
  };
}

export function toArrayAsync(
  source: GeneratorProvider<unknown> | AsyncGeneratorProvider<unknown>,
  signal?: AbortSignal,
) {
  return async function toArrayAsyncConsumer<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): Promise<TInput[]> {
    const acc: TInput[] = [];
    const resolvable = await createResolvable<TInput[]>();
    if (signal?.aborted) {
      void source.return();
      return Promise.resolve(acc);
    }
    addReturnRootOnAbortListener(signal, source);
    signal?.addEventListener("abort", () => resolvable.resolve(acc));
    return Promise.race([
      resolvable.promise,
      invoke(async function () {
        for await (const next of generator) {
          if (signal?.aborted) {
            return resolvable.promise;
          }
          acc.push(next);
        }
        return acc;
      }),
    ]);
  };
}
