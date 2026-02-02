import { delayValue } from "../tests/utils/delayValue.ts";
import { MockIYieldedParallelGenerator } from "../tests/utils/MockIYieldedParallelGenerator.ts";
import { parallelGenerator } from "./generators/ParallelGenerator.ts";
import type { IYieldedParallelGenerator } from "./shared.types.ts";

function sourceGenerator(count: number): IYieldedParallelGenerator<number> {
  const numbers = [];
  for (let i = 1; i <= count; i++) {
    numbers.push(i);
  }
  console.log("numbes", numbers);
  return MockIYieldedParallelGenerator(numbers);
}
const gen = parallelGenerator<number, number>({
  generator: sourceGenerator(3),
  onNext: async (x) => {
    console.log("run on next");
    const res = [await delayValue((await x) * 2, 50 - (await x) * 10)];
    console.log("GOT RES", res);
    return res;
  },
  parallel: 3,
  maxBuffer: 10,
});
console.log("GET FIRST");

gen.next().then(async (next) => {
  console.log("GOT FIRST", await gen.next());
});
