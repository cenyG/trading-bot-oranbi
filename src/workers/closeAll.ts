import TradeSimulator from "../service/TradeSimulator";
import Pair from "../util/pair";
import config from "../config";

Promise.resolve().then(async () => {
  for (const pair of Object.keys(config.pairs)) {
    const tradeSimulator = new TradeSimulator(Pair.fromOranbi(pair), config.delay)

    await tradeSimulator.closeAllOrders()

    console.log('close all orders done')
  }
})
