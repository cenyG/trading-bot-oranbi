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

const querystring = require('querystring')

export default class OranbiApi {
  static BASE_URL = 'https://oranbi.com'

  ID: string
  TOKEN: string

  async login(username: string, password: string) {
    const url = `${OranbiApi.BASE_URL}/Api/Login/login`

    const res = await axios.post(url, querystring.stringify({username, password}))

    this.ID = res.data.data.ID
    this.TOKEN = res.data.data.TOKEN

    return res.data
  }

  async pairs(): Promise<Array<OranbiPair>> {
    const url = `${OranbiApi.BASE_URL}/Api/External/pairs`

    const res = await axios.get(url)

    return res.data.data.market
  }

  async placeOrder(market: string, price: string, num: string, type: number): Promise<OranbiPlaceOrderResponse> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/upTrade`
    // price = new BigNumber(price).toFixed(8)

    const bodyFormData = this.createFormData({ market, price, num, type})

    const res = await axios.post(url, bodyFormData, {
      headers: this.composeHeaders(bodyFormData)
    })

    if (res.data.status === 0) {
      console.log(`[WARN:placeOrder] ${res.data.data}`)
    }
    console.log(`[INFO:${market}] ${type===1? "BUY" : "SELL"} ${num}, price: ${price}`)

    return res.data
  }

  async closeOrder(id: number): Promise<OranbiCloseOrderResponse> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/reject/id/${id}`

    const res = await axios.post(url, null, {
      headers: this.authHeaders()
    })

    if (res.data.status === 0) {
      console.log(`[WARN:closeOrder] ${res.data.data}`)
    }
    console.log(`[INFO] close order ${id}`)

    return res.data
  }

  async myOpenOrders(market: string): Promise<MyOpenOrdersResponse> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/MyOpenOrders/market/${market}`

    const res = await axios.post(url, null, {
      headers: this.authHeaders()
    })

    if (res.data.status === 0) {
      console.log(`[WARN:myOpenOrders] ${res.data.data}`)
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
