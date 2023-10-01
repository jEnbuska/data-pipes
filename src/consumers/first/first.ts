import { type GeneratorProvider } from "../../types";

export function first<Default, ImperativeInput = never>(
  ...args: [Default] | []
) {
  return function firstConsumer<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): Default | Input {
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
