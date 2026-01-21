import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function distinctBy<In, TSelect>(
  selector: (next: In) => TSelect,
): YieldedProvider<In>;
export function distinctBy(
  selector: (next: unknown) => unknown,
): YieldedProvider<unknown> {
  return () => {
    const set = new Set<unknown>();
    return {
      *onNext(next) {
        const selected = selector(next);
        if (set.has(selected)) return;
        set.add(selected);
        yield $next(next);
      },
    };
  };
}
