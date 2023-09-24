import { type ChainableGenerator } from "../../types";

export type ToSingleArgs<Default> = [Default] | [];
export function toSingle<Input, Default = Input>(
  generator: ChainableGenerator<Input>,
  ...args: ToSingleArgs<Default>
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
