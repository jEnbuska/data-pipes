import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../../types";

export function toArray<ImperativeTInput = never>() {
  return function toArrayConsumer<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): TInput[] {
    return [...generator];
  };
}

export function toArrayAsync<ImperativeTInput = never>() {
  return async function toArrayAsyncConsumer<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): Promise<TInput[]> {
    const acc: TInput[] = [];
    for await (const next of generator) {
      acc.push(next);
    }
    return acc;
  };
}
