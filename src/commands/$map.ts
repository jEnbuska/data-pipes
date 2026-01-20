import type { MaybeAwaited } from "../types.ts";

type MapCallback<TIn, TOut> = (value: TIn) => TOut;
export type MapPayload<TIn, TOut, ToAwaited extends boolean> = {
  type: "$map";
  callback: MapCallback<TIn, TOut>;
  toAwaited: ToAwaited;
};

export function* $map<TIn, TOut, TAsync extends boolean>(
  toAwaited: TAsync,
  callback: MapCallback<TIn, TOut>,
): Generator<
  MapPayload<TIn, TOut, TAsync>,
  MaybeAwaited<TAsync, TOut>,
  MaybeAwaited<TAsync, TOut>
> {
  return yield { type: "$map", callback, toAwaited };
}
