import { type ChainableGenerator } from "../../types";

export function toConsumer(generator: ChainableGenerator<unknown>) {
  void [...generator];
}
