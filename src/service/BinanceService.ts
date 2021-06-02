import BinanceApi from "../api/BinanceApi";

export default class BinanceService {
  binanceApi : BinanceApi
  pairs : Array<string>
  prices : any
  updateDelay: number
  intervalId: NodeJS.Timeout

  constructor(pairs: string[], updateDelay = 1000) {
    this.binanceApi = new BinanceApi()
    this.pairs = pairs
    this.prices = {}
    this.updateDelay = updateDelay
  }

  async start() {
    this.intervalId = setInterval(this.updatePrices.bind(this), this.updateDelay)
    console.log('set', this.intervalId)
  }

  async stop() {
    clearInterval(this.intervalId)
    console.log('clear', this.intervalId)
  }

  async updatePrices() {
    for (const pair of this.pairs) {
      const { bids, asks } = await this.binanceApi.orderBook(pair)

      const price = {
        bid: bids[0][0],
        ask: asks[0][0],
      }
      this.prices[pair] = price

      console.log(`Updated ${pair}. Bid ${price.bid}. Ask ${price.ask}`)
    }
  }
}

const service = new BinanceService(['BTCUSDT'])
service.start()

setTimeout(service.stop.bind(service), 10000)
setTimeout(()=>console.log('paka'), 20000)
