import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../../types";

export function first<Default, ImperativeTInput = never>(
  ...args: [Default] | []
) {
  return function firstConsumer<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): Default | TInput {
    const result = generator.next();
    if (result.done) {
      if (args.length) {
        return args[0];
      }
      throw new Error("No items in generator");
    }
    return result.value;
  };
}
export function firstAsync<Default, ImperativeTInput = never>(
  ...args: [Default] | []
) {
  return async function firstAsyncConsumer<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): Promise<Default | TInput> {
    const result = await generator.next();
    if (result.done) {
      if (args.length) {
        return args[0];
      }
      throw new Error("No items in generator");
    }
    return result.value;
  };
}
