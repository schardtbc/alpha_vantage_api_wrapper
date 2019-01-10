import { avForexDaily, avForexExchangeRate, avHistory, avHistoryAdj, avIntraday, avMACD, avQuote, toCamelCase } from "./avc";

test("toCamelCase()", () => {
  expect(toCamelCase("2. MACD_Hist")).toEqual("MACDHist")
})


test("avClient Quote() works with async await()", async () => {
  const res = await avQuote("AAPL");
  expect(res).toEqual(
    expect.objectContaining({
      symbol: expect.any(String),
      open: expect.any(Number),
      high: expect.any(Number),
      low: expect.any(Number),
      price: expect.any(Number),
      volume: expect.any(Number),
      latestTradingDay: expect.any(String),
      previousClose: expect.any(Number),
      change: expect.any(Number),
      changePercent: expect.any(Number)
    })
  );
},18000);

test("avIntraday() works with async await()", async () => {
  const res = await avIntraday("AAPL");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
        volume: expect.any(Number)
      })
    ])
  );
},18000);

test("avHistory() works with async await()", async () => {
  const res = await avHistory("AAPL");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
        volume: expect.any(Number)
      })
    ])
  );
},18000);

test("avHistoryAdj() works with async await()", async () => {
  const res = await avHistoryAdj("AAPL");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
        adjustedClose: expect.any(Number),
        volume: expect.any(Number),
        dividendAmount: expect.any(Number),
        splitCoefficient: expect.any(Number)
      })
    ])
  );
},18000);

test("avForexDaily() works with async await()", async () => {
  const res = await avForexDaily("EUR","USD");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        dateTime: expect.any(String),
        open: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        close: expect.any(Number),
      })
    ])
  );
},18000);

test("avForexExchangeRate() works with async await()", async () => {
  const res = await avForexExchangeRate("EUR","USD");
  expect(res).toEqual(
      expect.objectContaining({
        "fromCurrencyCode": expect.any(String),
        "fromCurrencyName": expect.any(String),
        "toCurrencyCode": expect.any(String),
        "toCurrencyName": expect.any(String),
        "exchangeRate": expect.any(Number),
        "lastRefreshed": expect.any(String),
        "timeZone": expect.any(String)
    })
  );
},18000);

test("avMACD() works with async await()", async () => {
  const res = await avMACD("AAPL");
  expect(res).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "dateTime": expect.any(String),
        "MACDSignal": expect.any(Number),
        "MACDHist": expect.any(Number),
        "MACD": expect.any(Number)
    })
    ])
  );
},18000);