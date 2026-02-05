import type { IYieldedParallelGenerator } from "../../src/shared.types.ts";
import { MockIYieldedParallelGenerator } from "./MockIYieldedParallelGenerator.ts";

export function parallelSource(
  count: number,
): IYieldedParallelGenerator<number> {
  const numbers = [];
  for (let i = 1; i <= count; i++) {
    numbers.push(i);
  }
  return MockIYieldedParallelGenerator(numbers);
}
