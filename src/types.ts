export type GeneratorProvider<T> = Generator<T, void, undefined & void>;

export type GeneratorMiddleware<Input, Output = Input> = (
  generator: GeneratorProvider<Input>,
) => GeneratorProvider<Output>;

export type PipeSource<Input> =
  | Input
  | Input[]
  | ((...args: never[]) => Generator<Input, void, void>);

export type CallableProvider<Input> = (
  ...inputs: Array<PipeSource<Input>>
) => Generator<Input, void, void>;

export interface GeneratorConsumer<Input> {
  toGenerator(): Generator<Input>;
  toArray(): Input[];
  toConsumer(): void;
  toSingle<Default = Input>(defaultValue?: Default): Input | Default;
  [Symbol.iterator](): Iterator<Input>;
}
export type Chainable<Input> = GeneratorConsumer<Input> & {
  map<Output>(fn: (next: Input) => Output): Chainable<Output>;
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Chainable<FlatArray<Input[], Depth>>;
  unflat(): Chainable<Input[]>;
  flatMap<Output>(
    callback: (value: Input) => Output | readonly Output[],
  ): Chainable<Output>;
  filter(fn: (next: Input) => boolean): Chainable<Input>;
  reduce<Output>(
    fn: (acc: Output, next: Input) => Output,
    initialValue: Output,
  ): Chainable<Output>;
  forEach(fn: (next: Input) => void): Chainable<Input>;
  skip(count: number): Chainable<Input>;
  skipLast(count: number): Chainable<Input>;
  skipWhile(fn: (next: Input) => boolean): Chainable<Input>;
  take(count: number): Chainable<Input>;
  takeLast(count: number): Chainable<Input>;
  count(): Chainable<number>;
  takeWhile(fn: (next: Input) => boolean): Chainable<Input>;
  sort(compareFn?: (a: Input, b: Input) => number): Chainable<Input>;
  groupBy<Key extends PropertyKey>(
    keySelector: (next: Input) => Key,
    groups: Key[],
  ): Chainable<Record<Key, Input[]>>;
  groupBy<Key extends PropertyKey>(
    keySelector: (next: Input) => Key,
  ): Chainable<Partial<Record<Key, Input[]>>>;
  distinctBy<Value>(selector: (next: Input) => Value): Chainable<Input>;
  distinctUntilChanged(
    comparator?: (previous: Input, current: Input) => boolean,
  ): Chainable<Input>;
  min(selector: (next: Input) => number): Chainable<Input>;
  max(selector: (next: Input) => number): Chainable<Input>;
  defaultIfEmpty<Default = Input>(
    defaultValue: Default,
  ): Chainable<Input | Default>;
  find(fn: (next: Input) => boolean): Chainable<Input>;
  some(fn: (next: Input) => boolean): Chainable<boolean>;
  every(fn: (next: Input) => boolean): Chainable<boolean>;
  reverse(): Chainable<Input>;
  // Custom GeneratorOperator
  lift<Output = never>(
    generatorFunction: GeneratorMiddleware<Input, Output>,
  ): Chainable<Output>;
};
