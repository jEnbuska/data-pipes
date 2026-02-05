import type { IYieldedAwaited } from "./generators/next/awaited";
import type { IYieldedBatch } from "./generators/next/batch";
import type { IYieldedChunkBy } from "./generators/next/chunkBy";
import type { IYieldedDrop } from "./generators/next/drop";
import type { IYieldedDropLast } from "./generators/next/dropLast";
import type { IYieldedFilter } from "./generators/next/filter.ts";
import type { IYieldedFlat } from "./generators/next/flat.ts";
import type { IYieldedFlatMap } from "./generators/next/flatMap.ts";
import type { IYieldedLift } from "./generators/next/lift.ts";
import type { IYieldedMap } from "./generators/next/map.ts";
import type { IYieldedParallel } from "./generators/next/parallel.ts";
import type { IYieldedReverse } from "./generators/next/reversed.ts";
import type { IYieldedSorted } from "./generators/next/sorted.ts";
import type { IYieldedTake } from "./generators/next/take.ts";
import type { IYieldedTakeLast } from "./generators/next/takeLast.ts";
import type { IYieldedTakeWhile } from "./generators/next/takeWhile.ts";
import type { IYieldedTap } from "./generators/next/tap.ts";
import type { IYieldedToSet } from "./resolvers/apply/toSet.ts";
import type {
  IAsyncYieldedResolver,
  IParallelYieldedResolver,
  IYieldedResolver,
} from "./resolvers/resolver.types.ts";
import type { IYieldedFlow } from "./shared.types.ts";

export interface IYielded<T>
  extends
    IYieldedOperations<T, "sync">,
    IYieldedResolver<T>,
    IYieldedAwaited<T> {}

export interface IAsyncYielded<T>
  extends
    IYieldedOperations<T, "async">,
    IAsyncYieldedResolver<T>,
    IYieldedParallel<T> {}

export interface IParallelYielded<T>
  extends
    IYieldedOperations<T, "parallel">,
    IParallelYieldedResolver<T>,
    IYieldedAwaited<T>,
    IYieldedParallel<T> {}

export interface IYieldedOperations<T, TFlow extends IYieldedFlow>
  extends
    IYieldedChunkBy<T, TFlow>,
    IYieldedBatch<T, TFlow>,
    IYieldedDrop<T, TFlow>,
    IYieldedDropLast<T, TFlow>,
    IYieldedTake<T, TFlow>,
    IYieldedTakeLast<T, TFlow>,
    IYieldedTakeWhile<T, TFlow>,
    IYieldedSorted<T, TFlow>,
    IYieldedReverse<T, TFlow>,
    IYieldedFilter<T, TFlow>,
    IYieldedMap<T, TFlow>,
    IYieldedFlatMap<T, TFlow>,
    IYieldedFlat<T, TFlow>,
    IYieldedLift<T, TFlow>,
    IYieldedTap<T, TFlow>,
    IYieldedToSet<T, TFlow> {}
