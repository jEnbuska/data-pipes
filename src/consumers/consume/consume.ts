import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../../types";

export function consume() {
  return function consumer(generator: GeneratorProvider<unknown>) {
    void [...generator];
  };
}

export function consumeAsync() {
  return async function consumerAsync(
    generator: AsyncGeneratorProvider<unknown>,
  ) {
    const gen = generator;
    while (true) {
      const { done } = await gen.next();
      if (done) return;
    }
  };
}
