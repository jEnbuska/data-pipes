import type { AsyncProvider } from "../types.ts";
import { YieldedBase } from "./YieldedBase.ts";

export class MultiAsyncYielded<
  TOut,
  TOptional extends boolean,
> extends YieldedBase<TOut, TOptional, true, true> {
  constructor(provider: AsyncProvider<TOut>, isOptional: TOptional) {
    super(provider, { isAsync: true, isMulti: true, isOptional });
  }
}
