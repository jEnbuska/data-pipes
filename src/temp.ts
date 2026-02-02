import { delayValue } from "../tests/utils/delayValue";
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
let index = 0;
const gen = parallelGenerator<number, number>({
  generator: sourceGenerator(30),
  parallel: 1,
  onNext: async (x) => {
    // TODO breaks up with empty
    return ++index % 2 ? [x, delayValue((await x) * 2, 10)] : [];
  },
});

(async function () {
  let next = await gen.next();
  while (!next.done) {
    next.value.then((it) => console.log(it));
    next = await gen.next();
  }
})();
