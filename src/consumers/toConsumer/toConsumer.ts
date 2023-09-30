import { type GeneratorProvider } from "../../types";

export function toConsumer() {
  return function toConsumerConsumer(generator: GeneratorProvider<unknown>) {
    void [...generator];
  };
}
