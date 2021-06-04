export default class Pair {
  base: string
  dist: string

  constructor(base: string, dist: string) {
    this.base = base
    this.dist = dist
  }

  static fromOranbi(oranbiString: string) {
    const arr = oranbiString.split('_')
    return new Pair(arr[0], arr[1])
  }

  oranbi() {
    return `${this.base.toLowerCase()}_${this.dist.toLowerCase()}`
  }

  binance() {
    return `${this.base.toUpperCase()}${this.dist.toUpperCase()}`
  }
}
