import { type OperatorGenerator } from "../../types";

export function toSingle<Input, Default = Input>(
  generator: OperatorGenerator<Input>,
  ...args: [Default] | []
): Default | Input {
  const result = generator.next();
  if (result.done) {
    if (args.length) {
      return args[0];
    }
    throw new Error("No items in generator");
  }
  return result.value;
}
