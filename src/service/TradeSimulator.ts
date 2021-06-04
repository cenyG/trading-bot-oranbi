import BigNumber from 'bignumber.js';

import BinanceService from "./BinanceService";
import OranbiApi from "../api/OranbiApi";
import Pair from "../util/pair";
import config from '../config'
import {randomFloat, randomInt} from '../util/random'
import wait from '../util/wait'

export default class TradeSimulator {
  working: boolean
  pair: Pair
  delay: number

  binanceService: BinanceService
  oranbiApi: OranbiApi


  constructor(pair: Pair, delay = 1000) {
    this.working = false
    this.pair = pair
    this.delay = delay

    this.binanceService = new BinanceService([pair.binance()])
    this.oranbiApi = new OranbiApi()
  }

  async start() {
    console.log(`[INFO] start ${this.pair.binance()} trade simulator`)

    this.working = true
    await this.binanceService.start()
    await this.authOranbi()
    await this.job()
  }

  stop() {
    console.log(`[INFO] stop ${this.pair.binance()} trade simulator`)

    this.working = false
    this.binanceService.stop()
  }

  private async job() {
    const {proc, amount: {min, max}} = config.pairs[this.pair.oranbi()]

    while (this.working) {
      let {bid, ask} = this.binanceService.getPrice(this.pair.binance())

      bid = new BigNumber(bid)
        .minus(new BigNumber(bid).multipliedBy(proc))                        // affected percent
        .minus(new BigNumber(bid).multipliedBy(randomFloat(0.001, 0.005)))    // to randomize bid value
        .toString()

      ask = new BigNumber(ask)
        .plus(new BigNumber(ask).multipliedBy(proc))                        // affected percent
        .plus(new BigNumber(ask).multipliedBy(randomFloat(0.001, 0.005)))     // to randomize bid value
        .toString()

      let openOrders
      switch (randomInt(1, 4)) {
        case 1:
          // place buy order
          await this.oranbiApi.placeOrder(this.pair.oranbi(), bid, randomFloat(min, max), 1)
          break;
        case 2:
          // place sell order
          await this.oranbiApi.placeOrder(this.pair.oranbi(), ask, randomFloat(min, max), 2)
          break;
        case 3:
          // just do nothing , to spam more orders then close
          // break
        case 4:
          openOrders = await this.oranbiApi.myOpenOrders(this.pair.oranbi())
          if (openOrders.entrust.length === 0) {
            console.warn(`[WARN] ${this.pair.binance()} no open orders`)

            //place buy and sell order
            await this.oranbiApi.placeOrder(this.pair.oranbi(), bid, randomFloat(min, max), 1)
            await this.oranbiApi.placeOrder(this.pair.oranbi(), ask, randomFloat(min, max), 2)

          } else {
            const randomOrderNum = randomInt(0, openOrders.entrust.length - 1)
            await this.oranbiApi.closeOrder(openOrders.entrust[randomOrderNum].id)
          }

          break;
      }

      await wait(this.delay)
    }
  }

  public async closeAllOrders() {
    await this.authOranbi()

    const openOrders = await this.oranbiApi.myOpenOrders(this.pair.oranbi())

    if (openOrders.entrust.length === 0) {
      console.log('[INFO] you have no orders')
    }
    console.log(`[INFO] closing ${openOrders.entrust.length} orders`)

    for (const order of openOrders.entrust) {
      await this.oranbiApi.closeOrder(order.id)
    }

    console.log('[INFO] close orders done')
  }

  private async authOranbi() {
    await this.oranbiApi.login(process.env.ORANBI_LOGIN, process.env.ORANBI_PASSWORD)
  }
}
