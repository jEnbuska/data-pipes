import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function dropLast<In>(count: number): YieldedProvider<In> {
  return () => {
    const buffer: In[] = [];
    let skipped = 0;
    return {
      *onNext(next) {
        buffer.push(next);
        if (skipped < count) {
          skipped++;
          return;
        }
        yield $next(buffer.shift()!);
      },
    };
  };
}
