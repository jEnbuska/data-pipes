import type { YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function tap<In>(consumer: (next: In) => unknown): YieldedProvider<In> {
  return () => ({
    *onNext(next: In) {
      consumer(next);
      yield $next(next);
    },
  });
}
