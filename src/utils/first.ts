export function first<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }
  return arr[0]!;
}
