export function randomFloat(from: number, to: number): string {
  return (Math.random() * (to - from) + from).toFixed(6)
}

export function randomInt(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from + 1) + from)
}
