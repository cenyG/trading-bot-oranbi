import axios from '../util/axios';
import {OrderBook} from "../types";


export default class BinanceApi {
  static BASE_URL = 'https://binance.com'

  async orderBook(symbol: string, limit = 5): Promise<OrderBook> {
    const url = `${BinanceApi.BASE_URL}/api/v3/depth`

    const res = await axios.get(url, {
      params: {
        symbol,
        limit
      }
    })

    if (res.status === 200) {
      return res.data
    }

    throw Error(JSON.stringify(res))
  }
}
