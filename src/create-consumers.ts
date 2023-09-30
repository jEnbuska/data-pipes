import { toArray, toConsumer, toSingle, toGenerator } from "./consumers";
import { type GeneratorProvider, type GeneratorConsumer } from "./types.ts";

export function createConsumers<Input>(
  generator: GeneratorProvider<Input>,
): GeneratorConsumer<Input> {
  return {
    [Symbol.iterator](): Iterator<Input> {
      return generator[Symbol.iterator]();
    },
    toArray() {
      return toArray()(generator);
    },
    toConsumer() {
      return toConsumer()(generator);
    },
    toSingle<Default>(...args: [Default] | []) {
      return toSingle<Default, Input>(...args)(generator);
    },
    toGenerator() {
      return toGenerator()(generator);
    },
  };
}
