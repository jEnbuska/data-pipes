import { type YieldedProvider } from "../../types.ts";
import { reduce } from "./reduce.ts";

export function countByAsync<In>(
  mapper: (next: In, index: number) => number,
): YieldedProvider<In, number, number> {
  return reduce((acc, ...rest) => acc + mapper(...rest), 0);
}
