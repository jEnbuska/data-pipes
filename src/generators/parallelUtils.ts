export function assertIsValidParallel(parallel: number) {
  if (parallel <= 0) {
    throw new RangeError("parallel must be greater than 0");
  }
  if (parallel > 50) {
    throw new RangeError("parallel must must be 50 or less");
  }
}
