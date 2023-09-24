import { type OperatorGenerator } from "../../types.ts";

export function toConsumer<T>(generator: OperatorGenerator<T>) {
  void [...generator];
}
