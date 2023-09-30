import {
  type Chainable,
  type GeneratorProvider,
  type GeneratorMiddleware,
  type PipeSource,
} from "./types";
import {
  min,
  max,
  find,
  some,
  filter,
  defaultIfEmpty,
  distinctBy,
  distinctUntilChanged,
  sort,
  map,
  flatMap,
  flat,
  unflat,
  groupBy,
  reverse,
  count,
  takeWhile,
  every,
  take,
  skip,
  skipWhile,
  forEach,
  reduce,
} from "./generators";
import { toArray, toGenerator, toConsumer, toSingle } from "./consumers";
import { takeLast } from "./generators/takeLast/takeLast.ts";
import { skipLast } from "./generators/skipLast/skipLast.ts";

function chainable<Input>(
  generator: GeneratorProvider<Input>,
): Chainable<Input> {
  return {
    reverse() {
      return chainable(reverse()(generator));
    },
    find(predicate) {
      return chainable(find(predicate)(generator));
    },
    defaultIfEmpty<Default>(defaultValue: Default) {
      return chainable(defaultIfEmpty(defaultValue)(generator));
    },
    min(callback) {
      return chainable(min(callback)(generator));
    },
    max(callback) {
      return chainable(max(callback)(generator));
    },
    distinctBy<Value>(selector: (next: Input) => Value) {
      return chainable(distinctBy(selector)(generator));
    },
    distinctUntilChanged(isEqual) {
      return chainable(distinctUntilChanged(isEqual)(generator));
    },
    sort(comparator) {
      return chainable(sort(comparator)(generator));
    },
    lift<Output>(middleware: GeneratorMiddleware<Input, Output>) {
      return chainable(middleware(generator));
    },
    groupBy<Key extends PropertyKey>(
      keySelector: (next: Input) => Key,
      groups?: Key[],
    ) {
      return chainable(groupBy(keySelector, groups)(generator)) as any;
    },
    flat<Depth extends number = 1>(depth?: Depth) {
      return chainable(flat(depth)(generator));
    },
    unflat() {
      return chainable(unflat()(generator));
    },
    map<Output>(mapper: (next: Input) => Output) {
      return chainable(map(mapper)(generator));
    },
    flatMap<Output>(callback: (next: Input) => Output | readonly Output[]) {
      return chainable(flatMap(callback)(generator));
    },
    filter(predicate) {
      return chainable(filter(predicate)(generator));
    },
    reduce<Output>(
      reducer: (acc: Output, next: Input) => Output,
      initialValue: Output,
    ) {
      return chainable(reduce(reducer, initialValue)(generator));
    },
    forEach(consumer) {
      return chainable(forEach(consumer)(generator));
    },
    skipWhile(predicate) {
      return chainable(skipWhile(predicate)(generator));
    },
    skip(count) {
      return chainable(skip(count)(generator));
    },
    skipLast(count: number): Chainable<Input> {
      return chainable(skipLast(count)(generator));
    },
    take(count) {
      return chainable(take(count)(generator));
    },
    takeLast(count) {
      return chainable(takeLast(count)(generator));
    },
    count() {
      return chainable(count()(generator));
    },
    takeWhile(predicate) {
      return chainable(takeWhile(predicate)(generator));
    },
    every(predicate) {
      return chainable(every(predicate)(generator));
    },
    some(predicate) {
      return chainable(some(predicate)(generator));
    },
    toSingle<Default>(...args: [Default] | []) {
      return toSingle(...args)(generator);
    },
    toArray() {
      return toArray()(generator);
    },
    toGenerator() {
      return toGenerator()(generator);
    },
    toConsumer() {
      toConsumer()(generator);
    },
  };
}

function isGeneratorFunction(
  source: unknown,
): source is () => Generator<unknown, unknown> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "GeneratorFunction"
  );
}

export default Object.assign(chainable, {
  from<Input>(...sources: Array<PipeSource<Input>>): Chainable<Input> {
    return chainable(
      (function* (): GeneratorProvider<Input> {
        for (const next of sources) {
          if (isGeneratorFunction(next)) {
            yield* next();
          } else if (Array.isArray(next)) {
            yield* next;
          } else {
            yield next;
          }
        }
      })(),
    );
  },
});
