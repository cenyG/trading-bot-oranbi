import {isMainThread, Worker, workerData} from "worker_threads";
import config from "../config";
import TradeSimulator from "../service/TradeSimulator";
import Pair from "../util/pair";
import delay from "../util/wait";
import Logger from "../util/logger";

const logger = new Logger('TRADE_SIMULATOR')

if (isMainThread) {
  Promise.resolve().then(async () => {
    for (const pair of Object.keys(config.pairs)) {
      await delay(1000)
      new Worker(__filename, {workerData: pair});
    }
  })
} else {
  Promise.resolve().then(async () => {
    while (true) {
      const tradeSimulator = new TradeSimulator(Pair.fromOranbi(workerData), config.delay)

      try {
        await tradeSimulator.start()
      } catch (err) {
        logger.error(err)
        await tradeSimulator.stop()
      }

      logger.error(`something went wrong on ${workerData.toUpperCase()}, going back to normal after ${config.delay}ms...`)
      await delay(config.delay)
    }
  })

}
