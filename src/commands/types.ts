import type { MaybeAwaited } from "../types.ts";
import type { MapPayload } from "./$map.ts";

export type YieldedCommand<
  TIn,
  TOut = TIn,
  ToAsync extends boolean = false,
> = MapPayload<TIn, TOut, ToAsync>;

export type YieldedCommandReturn<
  TAsync extends boolean,
  TPayload,
  TOut,
> = Generator<TPayload, MaybeAwaited<TAsync, TOut>, MaybeAwaited<TAsync, TOut>>;
