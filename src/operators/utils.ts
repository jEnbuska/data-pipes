export function* yieldMin<T>(
  array: T[],
  selector: (next: T) => number,
): IterableIterator<T> {
  if (array.length === 0) {
    return;
  }
  const [first, ...rest] = array;
  let currentMin: number = selector(first);
  let current = first;
  for (const next of rest) {
    const value = selector(next);
    if (value > currentMin) {
      current = next;
      currentMin = value;
    }
  }
  yield current;
}
