import { type GeneratorProvider } from "../../types";

export function consume() {
  return function consumer(generator: GeneratorProvider<unknown>) {
    void [...generator];
  };
}
