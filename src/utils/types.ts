export type ThrottleQueueItem<TArgs extends any[], TReturn> = {
  args: TArgs;
  resolvable: PromiseWithResolvers<TReturn>;
};
