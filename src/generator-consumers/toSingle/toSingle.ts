import { type OperatorGenerator } from "../../types.ts";

export function toSingle<T, R = T>(
  generator: OperatorGenerator<T>,
  ...args: [R] | []
): R | T {
  const result = generator.next();
  if (result.done) {
    if (args.length) {
      return args[0];
    }
    throw new Error("No items in generator");
  }
  return result.value;
}
