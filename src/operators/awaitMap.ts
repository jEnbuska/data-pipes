/* import { type OperatorGenerator } from "./types.ts";
import { operator } from "../pipes/operator.ts";

export function awaitMap<T>(generator: OperatorGenerator<T>) {
  return <R>(callback: (next: T) => Promise<R>) =>
    operator(async function* () {
      for (const next of generator()) {
        yield await callback(next);
      }
    });
} */

export default { a: 2 };
