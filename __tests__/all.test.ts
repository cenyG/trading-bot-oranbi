import BinanceApi from "../src/api/BinanceApi";
import OranbiApi from "../src/api/OranbiApi";

describe('all tests', () => {

  beforeAll(async () => {
    //do something before
  });

  afterAll(() => {
    //do something before
  });

  it('binance api /orderBook', async () => {
    const api = new BinanceApi()

    const orderBook = await api.orderBook('BTCUSDT')

    expect(orderBook.bids).toHaveLength(5)
    expect(orderBook.asks).toHaveLength(5)
  });

  it('oranbi api /pairs', async () => {
    const api = new OranbiApi()

    const pairs = await api.pairs()
    expect(pairs.length).toBeGreaterThan(5)

  });
});
