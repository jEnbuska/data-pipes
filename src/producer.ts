import { InternalStreamless } from "./utils";

export async function createProducer<T>(...queue: T[]) {
  let resolvable = InternalStreamless.createResolvable<undefined>();
  let done = false;
  async function* producerGenerator() {
    while (true) {
      while (queue.length) {
        yield queue.shift()!;
      }
      if (done) return;
      resolvable = InternalStreamless.createResolvable<undefined>();
      await resolvable.then((resolvable) => resolvable.promise);
    }
  }
  return Object.assign(producerGenerator, {
    async push(next: T) {
      queue.push(next);
      await resolvable.then((resolvable) => resolvable.resolve(undefined));
    },
    done() {
      done = true;
    },
  });
}
