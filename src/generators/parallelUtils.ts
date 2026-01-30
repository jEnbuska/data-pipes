export function assertIsValidParallelArguments(args: {
  parallel: number;
  parallelOnNext?: number;
}) {
  const { parallel, parallelOnNext = parallel } = args;
  if (parallelOnNext > parallel) {
    throw new RangeError("parallelOnNext must be same or less than parallel");
  }
  if (parallel <= 0) {
    throw new RangeError("parallel must be greater than 0");
  }
  if (parallelOnNext <= 0) {
    throw new RangeError("parallelOnNext must be greater than 0");
  }
}
