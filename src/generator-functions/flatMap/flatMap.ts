import { type OperatorGenerator } from "../../types.ts";

export function* flatMap<T, R>(
  generator: OperatorGenerator<T>,
  callback: (next: T) => R | readonly R[],
): OperatorGenerator<R> {
  for (const next of generator) {
    const out = callback(next);
    if (Array.isArray(out)) {
      yield* out as any;
    } else {
      yield out as R;
    }
  }
}
