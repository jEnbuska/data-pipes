import { GeneratorProvider } from "./types.ts";

export function* callable<Input = never>(
  input: Input,
): GeneratorProvider<Input> {
  return yield input;
}
