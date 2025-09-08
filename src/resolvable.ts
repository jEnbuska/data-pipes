export function createResolvable<R>(): Promise<{
  promise: Promise<R>;
  resolve(data: R): void;
}> {
  // eslint-disable-next-line promise/param-names
  return new Promise((resolveCreateResolvable) => {
    const promise = new Promise<R>((resolve) =>
      resolveCreateResolvable({
        get promise(): Promise<R> {
          return promise;
        },
        resolve(data: R) {
          resolve(data);
        },
      }),
    );
  });
}
