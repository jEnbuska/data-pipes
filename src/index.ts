import { chainable } from "./chainable";
import { type ChainableGenerator, type Chainable } from "./types";

function isGeneratorFunction(
  source: unknown,
): source is () => Generator<unknown, unknown> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "GeneratorFunction"
  );
}

export default function pipe<Input>(
  ...sources: Array<Input | Input[] | (() => Generator<Input, void, void>)>
): Chainable<Input> {
  return chainable(
    (function* (): ChainableGenerator<Input> {
      for (const next of sources) {
        if (isGeneratorFunction(next)) {
          yield* next();
        } else if (Array.isArray(next)) {
          yield* next;
        } else {
          yield next;
        }
      }
    })(),
  );
}
