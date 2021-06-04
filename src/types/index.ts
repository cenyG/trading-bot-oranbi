type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift'
type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
  Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>>
  & {
  readonly length: L
  [I: number]: T
  [Symbol.iterator]: () => IterableIterator<T>
}
export type OrderBook = {
  lastUpdateId: number;
  bids: Array<FixedLengthArray<string, 2>>;
  asks: Array<FixedLengthArray<string, 2>>;
}

export type OranbiPair = {
  ticker_id: string,
  base: string,
  target: string
}

export type OranbiPlaceOrderResponse = {
  info: string,
  status: number,
  url: string
}

export type OranbiCloseOrderResponse = OranbiPlaceOrderResponse

export type DefaultHeaders = {
  "Content-Type"?: string;
  "id"?: string;
  "TOKEN"?: string;
}

export type Order = {
  addtime: string;
  type: string;
  price: number;
  num: number;
  deal: number;
  id: number;
  first: string;
  base: string;
}

export type MyOpenOrdersResponse = {
  entrust: Array<Order>,
  usercoin: any
}

export type Price = {
  bid: string;
  ask: string;
}
