import { createResolvable } from "./resolvable.ts";

export async function createProducer<T>(...queue: T[]) {
  let resolvable = createResolvable<undefined>();
  async function* producerGenerator() {
    while (true) {
      while (queue.length) {
        yield queue.shift()!;
      }
      resolvable = createResolvable<undefined>();
      await resolvable.then((resolvable) => resolvable.promise);
    }
  }
  return Object.assign(producerGenerator, {
    async push(next: T) {
      queue.push(next);
      await resolvable.then((resolvable) => resolvable.resolve(undefined));
    },
  });
}
