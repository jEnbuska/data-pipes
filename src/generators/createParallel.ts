import type { IYieldedParallelGenerator } from "../shared.types.ts";
import { ParallelGenerator } from "./ParallelGenerator.ts";

export function createParallel<T, TOut = T>(
  args: ConstructorParameters<typeof ParallelGenerator<T, TOut>>[0],
): IYieldedParallelGenerator<TOut> {
  return new ParallelGenerator<T, TOut>({
    generator: args.generator,
    parallel: args.parallel,
    onNext: args.onNext,
    onDepleted: args.onDepleted,
    onDone: args.onDone,
    chokeOnNext: args.chokeOnNext,
  });
}
