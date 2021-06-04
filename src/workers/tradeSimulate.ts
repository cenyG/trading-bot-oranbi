import {isMainThread, Worker, workerData } from "worker_threads";
import config from "../config";
import TradeSimulator from "../service/TradeSimulator";
import Pair from "../util/pair";

if (isMainThread) {
  for (const pair of Object.keys(config.pairs)) {
    new Worker(__filename, { workerData: pair });
  }


} else {
  Promise.resolve().then(async() => {
    while (true) {

      const tradeSimulator = new TradeSimulator(Pair.fromOranbi(workerData), config.delay)

      try {
        await tradeSimulator.start()
        // await tradeSimulator.closeAllOrders()

      } catch (err) {
        console.error(`[${workerData}] error`)
        console.error(err)

        await tradeSimulator.stop()
      }
    }

  })

}
