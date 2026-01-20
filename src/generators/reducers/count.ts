import { defineOperator } from "../../defineOperator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";
import { reduceAsync, reduceSync } from "./reduce.ts";

function countReducer(_acc: unknown, _next: unknown, index: number) {
  return index + 1;
}
export function countSync<TArgs extends any[]>(): SyncOperatorResolver<
  TArgs,
  unknown,
  number
> {
  return reduceSync<TArgs, unknown, number>(countReducer, 0);
}

export function countAsync<TArgs extends any[]>(): AsyncOperatorResolver<
  TArgs,
  unknown,
  number
> {
  return reduceAsync<TArgs, unknown, number>(countReducer, 0);
}

export default defineOperator({
  name: "count",
  countAsync,
  countSync,
  toOne: false,
});
