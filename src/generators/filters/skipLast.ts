import { $next } from "../../commands/$next.ts";
import { defineOperator } from "../../defineOperator.ts";

export function skipLast<TIn>(count: number) {
  return function* skipLastAsyncResolver() {
    const buffer: TIn[] = [];
    let skipped = 0;
    while (true) {
      const value = yield* $next<TIn>();
      buffer.push(value);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.unshift() as TIn;
    }
  };
}

export default defineOperator({
  name: "skipLast",
  toMaybe: true,
  resolver: skipLast,
});
