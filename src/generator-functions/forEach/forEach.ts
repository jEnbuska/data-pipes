import { type OperatorGenerator } from "../../types.ts";

export function* forEach<T>(
  generator: OperatorGenerator<T>,
  consumer: (next: T) => unknown,
) {
  for (const next of generator) {
    consumer(next);
    yield next;
  }
}
