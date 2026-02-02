import type { IYieldedAwaited } from "./generators/next/awaited";
import type { IYieldedBatch } from "./generators/next/batch";
import type { IYieldedChunkBy } from "./generators/next/chunkBy";
import type { IYieldedDistinctBy } from "./generators/next/distinctBy";
import type { IYieldedDistinctUntilChanged } from "./generators/next/distinctUntilChanged";
import type { IYieldedDrop } from "./generators/next/drop";
import type { IYieldedDropLast } from "./generators/next/dropLast";
import type { IYieldedDropWhile } from "./generators/next/dropWhile.ts";
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
  IYieldedResolver,
} from "./resolvers/resolver.types.ts";

export interface IAsyncYielded<T>
  extends
    IYieldedOperations<T, true>,
    IAsyncYieldedResolver<T>,
    IYieldedParallel<T> {}

export interface IYielded<T>
  extends
    IYieldedOperations<T, false>,
    IYieldedResolver<T>,
    IYieldedAwaited<T> {}

export interface IYieldedOperations<T, TAsync extends boolean>
  extends
    IYieldedChunkBy<T, TAsync>,
    IYieldedBatch<T, TAsync>,
    IYieldedDrop<T, TAsync>,
    IYieldedDropLast<T, TAsync>,
    IYieldedDropWhile<T, TAsync>,
    IYieldedTake<T, TAsync>,
    IYieldedTakeLast<T, TAsync>,
    IYieldedTakeWhile<T, TAsync>,
    IYieldedSorted<T, TAsync>,
    IYieldedReverse<T, TAsync>,
    IYieldedDistinctBy<T, TAsync>,
    IYieldedDistinctUntilChanged<T, TAsync>,
    IYieldedFilter<T, TAsync>,
    IYieldedMap<T, TAsync>,
    IYieldedFlatMap<T, TAsync>,
    IYieldedFlat<T, TAsync>,
    IYieldedLift<T, TAsync>,
    IYieldedTap<T, TAsync>,
    IYieldedToSet<T, TAsync> {}
