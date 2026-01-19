export default function range(n: number): number[] {
  const acc: number[] = [];
  for (let i = 0; i < n; i++) {
    acc.push(i);
  }
  return acc;
}
