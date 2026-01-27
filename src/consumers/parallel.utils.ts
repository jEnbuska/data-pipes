export function createExtendPromise() {
  const set = new Set<Promise<unknown>>();
  async function addPromise(promise: Promise<unknown>) {
    set.add(promise);
    try {
      await promise;
    } finally {
      set.delete(promise);
    }
  }
  async function awaitAll() {
    let resolve = new Set(set);
    while (resolve.size) {
      await Promise.all(resolve.values());
      resolve = set.difference(resolve);
    }
  }
  return {
    addPromise,
    awaitAll,
  };
}
