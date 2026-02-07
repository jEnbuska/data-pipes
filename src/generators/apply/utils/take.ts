export function assertNotNegative(count: number): asserts count is number {
  if (count < 0) throw new RangeError(`${count} must be positive`);
}
