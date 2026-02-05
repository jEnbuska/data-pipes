import { MockIYieldedParallelGenerator } from "../tests/utils/MockIYieldedParallelGenerator.ts";
import { ParallelGenerator } from "./generators/ParallelGenerator.ts";
import type { IYieldedParallelGenerator } from "./shared.types.ts";

function sourceGenerator(count: number): IYieldedParallelGenerator<number> {
  const numbers = [];
  for (let i = 1; i <= count; i++) {
    numbers.push(i);
  }
  console.log("numbes", numbers);
  return MockIYieldedParallelGenerator(numbers);
}
const gen = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  onNext: function* (x) {
    yield x;
    yield 1 as number;
  },
});
const gen2 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  onNext: async function* (x) {
    yield x;
    yield 1;
  },
});
const gen3 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  onNext(x) {
    return [x, 1];
  },
});
const gen4 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  onNext(x) {
    return [1];
  },
});
const gen5 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  async onNext(x) {
    return [1];
  },
});
const gen6 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  async onNext(x) {
    return undefined;
  },
});
const gen7 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  onNext(x) {
    return undefined;
  },
});

const gen8 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  onNext: function* (x) {
    return;
  },
});

const gen9 = ParallelGenerator.create<number, number>({
  generator: sourceGenerator(100),
  parallel: 20,
  onNext: async function* (x) {
    return;
  },
});

const values: Array<Promise<string | number>> = [];
(async function getNext() {
  gen.next().then(async (next) => {
    if (next.done) {
      console.log("-----DONE----");
      console.log("VALUES", await Promise.all(values));
      return;
    }
    values.push(next.value);
    console.log("1 next", next);
    next.value.then((value) => {
      console.log("value", value);
    });
    console.log("next value");
    return getNext();
  });
})();
