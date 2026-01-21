import { type YieldedProvider } from "../../types.ts";
import { reduce } from "./reduce.ts";

function counter(_acc: unknown, _next: unknown, index: number) {
  return index + 1;
}
export function count<In>(): YieldedProvider<In, number, number> {
  return reduce<In, number>(counter, 0);
}
