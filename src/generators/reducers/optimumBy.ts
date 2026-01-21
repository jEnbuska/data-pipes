import type { YieldedProvider } from "../../types.ts";
import { reduce } from "./reduce.ts";

export function optimumBy<In>(
  callback: (optimum: In, next: In) => boolean,
): YieldedProvider<In, In, In | undefined> {
  return reduce<In>((acc, next) => {
    if (callback(acc, next)) return next;
    return acc;
  });
}
