import { OperatorGenerator } from "../types.ts";

export function toConsumer<T>(generator: OperatorGenerator<T>) {
  for (const _ of generator()) {
  }
}
