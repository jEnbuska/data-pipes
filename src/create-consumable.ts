import { toArray, toConsumer, first } from "./consumers";
import { type GeneratorProvider, type GeneratorConsumable } from "./types.ts";

export function createConsumable<Input>(
  generator: GeneratorProvider<Input>,
): GeneratorConsumable<Input> {
  return {
    [Symbol.iterator]: generator[Symbol.iterator].bind(generator),
    [Symbol.toStringTag]: "GeneratorConsumer",
    toArray() {
      return toArray()(generator);
    },
    consume() {
      return toConsumer()(generator);
    },
    first<Default>(...args: [Default] | []) {
      return first<Default, Input>(...args)(generator);
    },
  };
}
