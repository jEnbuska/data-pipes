import type { IYieldedParallel } from "../generators/apply/parallel.ts";
import type { IYieldedOperations } from "../generators/types.ts";
import type { IAsyncYieldedResolver } from "../resolvers/async/types.ts";

export interface IAsyncYielded<T>
  extends
    IYieldedOperations<T, "async">,
    IAsyncYieldedResolver<T>,
    IYieldedParallel<T> {}
