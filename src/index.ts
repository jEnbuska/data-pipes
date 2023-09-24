import { chainable, type Chainable } from "./chainable";
import { type OperatorGenerator } from "./types";

function isGeneratorFunction(
  source: unknown,
): source is () => Generator<unknown, unknown> {
  return Object.getPrototypeOf(source).constructor.name === "GeneratorFunction";
}

export default function pipe<Input>(
  ...sources: Array<Input | Input[] | (() => Generator<Input, void, void>)>
): Chainable<Input> {
  return chainable(
    (function* (): OperatorGenerator<Input> {
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
