import axios from '../util/axios';
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

    const bodyFormData = this.createFormData({ market, price, num, type})

    const res = await axios.post(url, bodyFormData, {
      headers: this.composeHeaders(bodyFormData)
    })

    return res.data
  }

  async closeOrder(id: number): Promise<OranbiCloseOrderResponse> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/reject/id/${id}`

    const res = await axios.post(url, null, {
      headers: this.authHeaders()
    })

    return res.data
  }

  async myOpenOrders(market: string): Promise<MyOpenOrdersResponse> {
    const url = `${OranbiApi.BASE_URL}/Api/Exchange/MyOpenOrders/market/${market}`

    const res = await axios.post(url, null, {
      headers: this.authHeaders()
    })

    return res.data.data
  }

}
