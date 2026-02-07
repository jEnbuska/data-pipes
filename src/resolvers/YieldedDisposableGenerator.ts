export class YieldedDisposableResolver<
  T extends IteratorObject<any> | AsyncGenerator<any>,
> {
  protected readonly generator: Disposable & T;

  protected readonly parent: undefined | Disposable;

  protected readonly signal?: AbortSignal;

  constructor(
    parent: undefined | Disposable,
    generator: T,
    signal?: AbortSignal,
  ) {
    this.parent = parent;
    this.signal = signal;
    this.generator = Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return?.(undefined);
        void parent?.[Symbol.dispose]();
      },
    });
    signal?.addEventListener("abort", () => {
      this.generator[Symbol.dispose]();
    });
  }
}
