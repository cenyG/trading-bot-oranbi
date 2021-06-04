const dotenv = require('dotenv')
dotenv.config()

export default {
  delay: 1000,
  pairs: {
    // btc_usdt: {
    //   proc: 0,                     // price difference from Binance -1..1
    //   amount: {                       // will take random number from min to max to place order
    //     min: 0.00001,
    //     max: 1
    //   }
    // },
    // eth_usdt: {
    //   proc: 0.05,
    //   amount: {
    //     min: 0.05,
    //     max: 3
    //   }
    // },
    // doge_btc: {
    //   proc: 0.05,
    //   amount: {
    //     min: 10,
    //     max: 200
    //   }
    // },
    doge_usdt: {
      proc: 0.05,
      amount: {
        min: 50,
        max: 400
      }
    }
  }
}
