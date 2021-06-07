import axios from '../util/axios';
// import BigNumber from 'bignumber.js';
import * as FormData from "form-data";
import {
  DefaultHeaders,
  MyOpenOrdersResponse,
  OranbiCloseOrderResponse,
  OranbiPair,
  OranbiPlaceOrderResponse
} from "../types";
import Logger from "../util/logger";
import delay from "../util/wait";

const querystring = require('querystring')

export default class OranbiApi {
  static BASE_URL = 'https://oranbi.com'

  logger: Logger

  ID: string
  TOKEN: string

  constructor() {
    this.logger = new Logger('ORANABI_API')
  }

  async login(username: string, password: string) {
    const url = `${OranbiApi.BASE_URL}/Api/Login/login`

    const res = await axios.post(url, querystring.stringify({username, password}))

    if (!res.data.data) {
      this.logger.warn('login failure. retry...')
      await delay(5000)

      return await this.login(username, password)
    }

    this.ID = res.data.data.ID
    this.TOKEN = res.data.data.TOKEN

    return res.data
  }

  async pairs(): Promise<Array<OranbiPair>> {
    const url = `${OranbiApi.BASE_URL}/Api/External/pairs`

    const res = await axios.get(url)

    return res.data.data.market
  }

  async placeOrder(market: string, price: string, num: string, type: number): Promise<OranbiPlaceOrderResponse|void> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/upTrade`
    // price = new BigNumber(price).toFixed(8)

    const bodyFormData = this.createFormData({ market, price, num, type})

    const res = await axios.post(url, bodyFormData, {
      headers: this.composeHeaders(bodyFormData)
    })

    const info = `${market.toUpperCase()} ${type===1? "BUY" : "SELL"} ${num}, price: ${price}`
    if (res.data.status === 0) {
      return this.logger.warn(`/placeOrder ${res.data.data}, info: ${info}`)
    }
    this.logger.info(info)

    return res.data
  }

  async closeOrder(id: number): Promise<OranbiCloseOrderResponse> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/reject/id/${id}`

    const res = await axios.post(url, null, {
      headers: this.authHeaders()
    })

    if (res.data.status === 0) {
      this.logger.warn(`/closeOrder ${res.data.data}`)
    }
    this.logger.info(`close order ${id}`)

    return res.data
  }

  async myOpenOrders(market: string): Promise<MyOpenOrdersResponse> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/MyOpenOrders/market/${market}`

    const res = await axios.post(url, null, {
      headers: this.authHeaders()
    })

    if (res.data.status === 0) {
      this.logger.warn(`/myOpenOrders ${res.data.data}`)
    }
    return res.data.data
  }

  private authHeaders() {
    const res: DefaultHeaders = {}

    if (this.ID) res.id = this.ID
    if (this.TOKEN) res.TOKEN = this.TOKEN

    return res
  }

  private composeHeaders(formData: FormData, headers={}) {
    return {
      ...this.authHeaders(),
      ...formData.getHeaders(),
      ...headers
    }
  }

  private createFormData(object): FormData {
    const bodyFormData = new FormData();

    for (const key of Object.keys(object)) {
      bodyFormData.append(key, object[key])
    }

    return bodyFormData
  }

}
