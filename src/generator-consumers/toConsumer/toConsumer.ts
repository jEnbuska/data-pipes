import { type OperatorGenerator } from "../../types";

export function toConsumer(generator: OperatorGenerator<unknown>) {
  void [...generator];
}
